//MIT License

//Copyright(c) 2017 NeoSmart Technologies

//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace NeoSmart.AsyncLock
{
    public class AsyncLock
    {
        private object _reentrancy = new object();
        private int _reentrances = 0;
        //We are using this SemaphoreSlim like a posix condition variable
        //we only want to wake waiters, one or more of whom will try to obtain a different lock to do their thing
        //so long as we can guarantee no wakes are missed, the number of awakees is not important
        //ideally, this would be "friend" for access only from InnerLock, but whatever.
        internal SemaphoreSlim _retry = new SemaphoreSlim(0, 1);
        //We do not have System.Threading.Thread.* on .NET Standard without additional dependencies
        //Work around is easy: create a new ThreadLocal<T> with a random value and this is our thread id :)
        private static readonly long UnlockedThreadId = 0; //"owning" thread id when unlocked
        internal long _owningId = UnlockedThreadId;
        private static int _globalThreadCounter;
        private static readonly ThreadLocal<int> _threadId = new ThreadLocal<int>(() => Interlocked.Increment(ref _globalThreadCounter));
        //We generate a unique id from the thread ID combined with the task ID, if any
        public static long ThreadId => (long)(((ulong)_threadId.Value) << 32) | ((uint)(Task.CurrentId ?? 0));

        struct InnerLock : IDisposable
        {
            private readonly AsyncLock _parent;
#if DEBUG
            private bool _disposed;
#endif

            internal InnerLock(AsyncLock parent)
            {
                this._parent = parent;
#if DEBUG
                this._disposed = false;
#endif
            }

            internal async Task ObtainLockAsync()
            {
                while (!this.TryEnter())
                {
                    //we need to wait for someone to leave the lock before trying again
                    await this._parent._retry.WaitAsync();
                }
            }

            internal async Task ObtainLockAsync(CancellationToken ct)
            {
                while (!this.TryEnter())
                {
                    //we need to wait for someone to leave the lock before trying again
                    await this._parent._retry.WaitAsync(ct);
                }
            }

            internal void ObtainLock()
            {
                while (!this.TryEnter())
                {
                    //we need to wait for someone to leave the lock before trying again
                    this._parent._retry.Wait();
                }
            }

            private bool TryEnter()
            {
                lock (this._parent._reentrancy)
                {
                    Debug.Assert((this._parent._owningId == UnlockedThreadId) == (this._parent._reentrances == 0));
                    if (this._parent._owningId != UnlockedThreadId && this._parent._owningId != AsyncLock.ThreadId)
                    {
                        //another thread currently owns the lock
                        return false;
                    }
                    //we can go in
                    Interlocked.Increment(ref this._parent._reentrances);
                    this._parent._owningId = AsyncLock.ThreadId;
                    return true;
                }
            }

            public void Dispose()
            {
#if DEBUG
                Debug.Assert(!this._disposed);
                this._disposed = true;
#endif
                lock (this._parent._reentrancy)
                {
                    Interlocked.Decrement(ref this._parent._reentrances);
                    if (this._parent._reentrances == 0)
                    {
                        //the owning thread is always the same so long as we are in a nested stack call
                        //we reset the owning id to null only when the lock is fully unlocked
                        this._parent._owningId = UnlockedThreadId;
                        if (this._parent._retry.CurrentCount == 0)
                        {
                            this._parent._retry.Release();
                        }
                    }
                }
            }
        }

        public IDisposable Lock()
        {
            var @lock = new InnerLock(this);
            @lock.ObtainLock();
            return @lock;
        }

        public async Task<IDisposable> LockAsync()
        {
            var @lock = new InnerLock(this);
            await @lock.ObtainLockAsync();
            return @lock;
        }

        public async Task<IDisposable> LockAsync(CancellationToken ct)
        {
            var @lock = new InnerLock(this);
            await @lock.ObtainLockAsync(ct);
            return @lock;
        }
    }
}
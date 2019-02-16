export class Utility {

  public static createGuid() {
     function _p8(s?) {
        const p = (Math.random().toString(16) + '000000000').substr(2, 8);
        return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p ;
     }

     return _p8() + _p8(true) + _p8(true) + _p8();
  }

  public static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

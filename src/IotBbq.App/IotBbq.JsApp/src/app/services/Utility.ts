export class Utility {
  public static MinDate = new Date(-8640000000000000);
  public static MaxDate = new Date(8640000000000000);

  public static MinGuid = '00000000-0000-0000-0000-000000000000';
  public static MaxGuid = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

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

  public static getScrollParent(node: Element): Element {
    const regex = /(auto|scroll)/;
    const parents = (_node, ps) => {
      if (_node.parentNode === null) { return ps; }
      return parents(_node.parentNode, ps.concat([_node]));
    };

    const style = (_node, prop) => getComputedStyle(_node, null).getPropertyValue(prop);
    const overflow = _node => style(_node, 'overflow') + style(_node, 'overflow-y') + style(_node, 'overflow-x');
    const scroll = _node => regex.test(overflow(_node));

    /* eslint-disable consistent-return */
    const scrollParent = (_node) => {
      if (!(_node instanceof HTMLElement || _node instanceof SVGElement)) {
        return;
      }

      const ps = parents(_node.parentNode, []);

      for (let i = 0; i < ps.length; i += 1) {
        if (scroll(ps[i])) {
          return ps[i];
        }
      }

      return document.scrollingElement || document.documentElement;
    };

    return scrollParent(node);
    /* eslint-enable consistent-return */
  }
}

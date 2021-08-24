import { Dispatch, SetStateAction } from 'react';

function redirectlogin(xhr: any) {}

export const XMLHttpReqHandler = (xmlHttpReq: boolean, setXmlHttpReq: Dispatch<SetStateAction<boolean>>) => {
    const accessor = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');

    Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
        get: function () {
            console.log('get responseText', this);
            redirectlogin(this);
            return accessor?.get?.call(this);
        },
        set: function (str) {
            console.log('set responseText: %s', str);
            return accessor?.set?.call(this, str);
        },
        configurable: true,
    });

    const rawOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        if (!xmlHttpReq) {
            setXmlHttpReq(true);
            setupHook(this);
        }
        rawOpen.apply(this, arguments as any);
    };

    function setupHook(xhr: any) {
        function getter() {
            console.log('response', xhr);
            delete xhr.responseText;
            var ret = xhr.responseText;
            setup();
            return ret;
        }

        function setter(str: any) {
            console.log('set responseText: %s', str);
        }

        function setup() {
            Object.defineProperty(xhr, 'responseText', {
                get: getter,
                set: setter,
                configurable: true,
            });
        }

        setup();
    }
};

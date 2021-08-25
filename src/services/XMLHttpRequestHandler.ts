import { Dispatch, SetStateAction } from 'react';

const UNDEFINED_ACCESS_TOKEN = "cannot read property 'access_token' of undefined";

enum Paths {
    INNLOGGET_BRUKER = 'api/arbeidsgiver/innlogget-bruker',
    LOGIN = '/login',
}

function redirectlogin(xhr: any) {
    if (
        ((xhr.status === 401 && xhr.responseURL.includes(Paths.INNLOGGET_BRUKER)) ||
            (xhr.status === 301 && xhr.responseURL.includes(Paths.LOGIN))) &&
        !window.location.pathname.includes('/login')
    ) {
        window.location.href = '/login';
    } else if (xhr.status === 500) {
        const str = xhr.response?.toString().toLowerCase() ?? '';
        const response = str.replace(/&#(\d+);/g, function (match: string, dec: number) {
            return String.fromCharCode(dec);
        });
        console.log('status response', response, response.includes(UNDEFINED_ACCESS_TOKEN));
        if (response.includes(UNDEFINED_ACCESS_TOKEN)) {
            window.location.href = '/login';
            console.log('OK. Disablet Redirect midlertidig');
        }
    }
}

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

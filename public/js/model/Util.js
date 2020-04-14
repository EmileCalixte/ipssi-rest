class Util {
    static setValueInLocalStorage(key, value) {
        window.localStorage.setItem(key, value);
    }

    static getValueInLocalStorage(key) {
        return window.localStorage.getItem(key);
    }
}
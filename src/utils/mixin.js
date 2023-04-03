/**
 * loading状态
 */
export function loadMixin () {
    let mmLoadShow = ref(true);
    let _hideLoad = function () {
        let timer;
        clearTimeout(timer);
        timer = setTimeout(() => {
            mmLoadShow.value = false;
        }, 200)
    }
    return {
        mmLoadShow,
        _hideLoad
    }
}
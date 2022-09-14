import ask from "../ask";

/**
 * 登录
 * @param
 * @return
 * @author     :loulan
 * */
export const login = () => {
    return ask.get(`site/admin/province/tree/list`)
}

/*********************************************************
 ** 设置状态数据
 ** <br><br>
 ** Date: Created in 2022/9/14 11:30
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
import state from "./state";
import {Menu} from "../common/domain/common";

export default {
    setScreenHeight: (state:any, param: number) => state.screenHeight = param,
    setScreenWidth: (state:any, param: number) => state.screenWidth = param,
    setMenus: (state: any, param: Array<Menu>) => state.menus = param,
    setUserInfo: (state: any, param: undefined) => state.userInfo = param,
}

/*********************************************************
 ** 菜单接口
 ** <br><br>
 ** Date: Created in 2022/9/20 11:41
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export interface Menu{
    id?: number;
    pid?: number;
    code?:string;
    name?:string;
    type?:number;
    path?:string;
    keepAlive?:boolean;
    status?:number;
    icon?:string;
    iconType?:number;
    orderNum?:number;
    children?: Array<Menu>;
}

/*********************************************************
 ** 用户信息接口
 ** <br><br>
 ** Date: Created in 2022/9/22 14:00
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export interface UserInfo{
    id?: number;
    username?: string;
    name?: string;
    phone?: string;
    email?: string;
    status?: number;
    sex?: number;
    birthday?: string;
    idCard?: string;
}

/*********************************************************
 ** 分页查询的条件参数
 ** <br><br>
 ** Date: Created in 2022/9/26 12:45
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export interface pageQuery{
    pageCurrent: number;
    pageSize: number;
}

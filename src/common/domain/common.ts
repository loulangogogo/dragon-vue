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
}

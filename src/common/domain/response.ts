
/*********************************************************
 ** 响应返回结果
 ** <br><br>
 ** Date: Created in 2022/9/16 11:58
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export interface ResponseResult{
    status?: number;
    msg?: string;
    taskId?: string;
    data?: any;
}

/*********************************************************
 ** 响应状态枚举表
 ** <br><br>
 ** Date: Created in 2022/9/16 15:57
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum ResponseStatusEnum {
    OK = 200,
}

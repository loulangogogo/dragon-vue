import ask from "../../ask";

/**
 * 获取所有的部门
 * @param
 * @return
 * @author     :loulan
 * */
export const getAllDept = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dept/getAllDept`);
}

/**
 * 部门的插入
 * @param
 * @return
 * @author     :loulan
 * */
export const deptSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dept/save`,data);
}

/**
 * 部门的更新
 * @param
 * @return
 * @author     :loulan
 * */
export const deptUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dept/update`,data);
}

/**
 * 根据部门的id删除菜单
 * @param
 * @return
 * @author     :loulan
 * */
export const deptDel = (id:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dept/delete/${id}`);
}




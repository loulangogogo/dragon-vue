/*********************************************************
 ** 状态枚举类型
 ** <br><br>
 ** Date: Created in 2022/9/29 11:07
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum StatusEnum {
    // 正常，启用
    ON = 1,
    // 不正常，停用
    OFF = 0
}

/*********************************************************
 ** 权限表状态字段的枚举值
 ** <br><br>
 ** Date: Created in 2022/9/29 11:16
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum PermissionTypeEnum{
    URL = 10,
    COMPONENT = 20,
}

/*********************************************************
 ** 菜单类型枚举值
 ** <br><br>
 ** Date: Created in 2022/9/29 12:08
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum MenuTypeEnum {
    MENU = 10,
    DIR = 20,
}

/*********************************************************
 ** 菜单图标类型
 ** <br><br>
 ** Date: Created in 2022/9/29 14:26
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum MenuIconTypeEnum {
    // 阿里图标库图标
    ALI = 10,
    // 图片图标
    IMG = 20,
    // 本地UI组件库图标
    ICON = 30,
}

/*********************************************************
 ** 用来区分添加和编辑的的枚举类型
 ** <br><br>
 ** Date: Created in 2022/9/29 14:44
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum AddEditEnum {
    ADD = 0,
    EDIT = 1,
}

/*********************************************************
 ** 资源角色中间表中关于资源类型的枚举数据
 ** <br><br>
 ** Date: Created in 2022/10/6 17:18
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum RoleResourcesTypeEnum {
    CLIENT = 10,
    USER = 20,
    MENU = 30,
    PERMISSION = 40
}

/*********************************************************
 **
 ** <br><br>
 ** Date: Created in 2022/10/7 18:39
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum SexEnum {
    MEN = 0,
    MAN = 1,
}



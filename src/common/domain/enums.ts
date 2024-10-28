/*********************************************************
 ** 环境枚举类型
 ** <br><br>
 ** Date: Created in 2023/03/19 11:50
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum EnvEnum {
    DEV = "dev",
    PROD = "prod",
    ERROR = "error env"
}


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
 ** 用户账号的状态
 ** <br><br>
 ** Date: Created in 2022/10/24 10:49
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum UserStatusEnum {
    // 正常
    NORMAL = 10,
    // 挂起
    HANG_UP = 20,
    // 注销
    CANCEL = 30
}

/*********************************************************
 ** 权限表状态字段的枚举值
 ** <br><br>
 ** Date: Created in 2022/9/29 11:16
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum PermissionTypeEnum {
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
    NO = 30,
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
    PERMISSION = 40,
    DEPT = 50,
}

/*********************************************************
 ** 特殊的角色类型枚举
 ** <br><br>
 ** Date: Created in 2023/12/12 18:37
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum RoleTypeSpecialEnum {
    // 客户端角色类型id
    CLIENT = 2,
    // 用户角色类型id
    USER = 1,
    // 部门角色类型id
    DEPT = 3,
}

/*********************************************************
 ** 特殊值枚举
 ** 比如很多树的顶级就是-1，一些特殊的存在都是-1
 ** <br><br>
 ** Date: Created in 2023/12/13 20:00
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum SpecialValueEnum {
    TOP = -1
}

/*********************************************************
 ** 性别枚举
 ** <br><br>
 ** Date: Created in 2022/10/7 18:39
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum SexEnum {
    MEN = 0,
    MAN = 1,
}

/*********************************************************
 ** 客户端类型枚举
 **
 ** @author loulan
 ** @since
 *********************************************************/
export enum ClientTypeEnum{
    // 其他
    OTHER = 0,
    // 管理端
    ADMIN = 10
}

/*********************************************************
 ** 授权类型枚举
 ** <br><br>
 ** Date: Created in 2022/10/25 12:04
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum GrantTypeEnum {
    AUTHORIZATION_CODE = "authorization_code",
    IMPLICIT = "implicit",
    PASSWORD = "password",
    REFRESH_TOKEN = "refresh_token",
    CLIENT_CREDENTIALS = "client_credentials",
    WECHAT_MINI_PROGRAM = "wechat_mini_program",
    WECHAT_MINI_PROGRAM_PHONE_RAL = "wechat_mini_program_phone_register_and_login",
    WECHAT_MINI_PROGRAM_RAL = "wechat_mini_program_register_and_login",
    WECHAT_SCAN = "wechat_scan",
    WECHAT_SCAN_RAL = "wechat_scan_register_and_login",
    WECHAT_APP = "wechat_app",
    WECHAT_APP_RAL = "wechat_app_register_and_login",
    PHONE = "phone",
    PHONE_RAL = "phone_register_and_login",
    EMAIL = "email",
    EMAIL_RAL = "email_register_and_login",
}

/*********************************************************
 ** 微信二维码类型
 ** <br><br>
 ** Date: Created in 2023/2/23 10:29
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum WechatQrcodeTypeEnum {
    // 登陆
    LOGIN = 10,
    // 注册
    REGISTER = 20,
    // 用户绑定和解绑
    BINDING_USER = 30,
}

/*********************************************************
 ** 邮件消息类型
 ** <br><br>
 ** Date: Created in 2023/2/26 21:38
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum EmailMessageTypeEnum {
    VALIFY_CODE = 10,
    REGISTER = 20,
    UN_REGISTER = 21,
    LOGIN = 30,
    BINGDING_USER = 40,
    FIX_PASSWORD = 50,
}

/*********************************************************
 ** 手机短信消息类型
 ** <br><br>
 ** Date: Created in 2023/2/26 21:38
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum PhoneMessageTypeEnum {
    VALIFY_CODE = 10,
    REGISTER = 20,
    UN_REGISTER = 21,
    LOGIN = 30,
    BINGDING_USER = 40,
    FIX_PASSWORD = 50,
}

/*********************************************************
 ** 生成文件的状态枚举
 ** <br><br>
 ** Date: Created in 2024/4/22 15:34
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum FileGenerateStatusEnum{
    // 等待中
    WAIT=0,
    // 已生成
    SUCCESS=10,
    // 生成失败
    FAIL=20,
    // 正在生成
    ING=30,
}

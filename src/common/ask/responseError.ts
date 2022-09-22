export default (error:any) => {
    // fixme 2022/9/21(待修改) 可以将错误信息保存到localStorage进行错误数据存储等等、
    console.error(error);
    console.error("响应信息错误。");
}

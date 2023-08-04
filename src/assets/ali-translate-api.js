import alimt20181012, * as $alimt20181012 from '@alicloud/ecs20140526';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
// const { default: alimt20181012 } = require('@alicloud/ecs20140526');
// const { Config } = require('@alicloud/openapi-client');
/*
阿里API
请保存或发送 AccessKey 至对应用户。当前窗口关闭后，无法再次查询 Secret。如果您遗失这个 AccessKey，可以创建新的来替代。
AccessKey ID
LTAI5tP6BVS32ReEBojGRwMf
AccessKey Secret
iUZ9udccL1q5nJgkr2gBJNGrtu0BrN
*/


const ALIBABA_CLOUD_ACCESS_KEY_ID = "LTAI5tP6BVS32ReEBojGRwMf"
const ALIBABA_CLOUD_ACCESS_KEY_SECRET = "iUZ9udccL1q5nJgkr2gBJNGrtu0BrN"

class Client {

    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(accessKeyId, accessKeySecret) {
        let config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
        });
        // Endpoint 请参考 https://api.aliyun.com/product/alimt
        config.endpoint = `mt.cn-hangzhou.aliyuncs.com`;
        return new alimt20181012(config);
    }

    static createClientWithSTS(accessKeyId, accessKeySecret, securityToken) {
        let config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
            // 必填，您的 Security Token
            securityToken: securityToken,
            // 必填，表明使用 STS 方式
            type: "sts",
        });
        // Endpoint 请参考 https://api.aliyun.com/product/alimt
        config.endpoint = `mt.cn-hangzhou.aliyuncs.com`;
        return new alimt20181012(config);
    }

    async PostTransloate(text_zh) {
        // 请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID 和 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
        // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html
        let client = Client.createClient(ALIBABA_CLOUD_ACCESS_KEY_ID, ALIBABA_CLOUD_ACCESS_KEY_SECRET);
        let translateGeneralRequest = new $alimt20181012.TranslateGeneralRequest({
            formatType: "text",
            sourceLanguage: "zh",
            targetLanguage: "en",
            sourceText: text_zh,
            scene: "general",
        });
        let runtime = new $Util.RuntimeOptions({});
        let resp = await client.translateGeneralWithOptions(translateGeneralRequest, runtime);
    }

}

// Client.PostTransloate("女孩");


// export default Client

const Core = require('@alicloud/pop-core');

export function sendSms(tel,verityCode){
    let client = new Core({
        accessKeyId: 'LTAIwtvvxVThpVTE',
        accessKeySecret: 'otCXRrjdnf0riDlQNEZobf6KMHDN7Q',
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25'
    });
    let TemplateParam={
        code:verityCode+''
    }
    let params = {
        "PhoneNumbers": tel+'',
        "SignName": "技能树",
        "TemplateCode": "SMS_162732922",
        "TemplateParam": JSON.stringify(TemplateParam)
    }
    let requestOption = {
        method: 'POST'
    };

    client.request('SendSms', params, requestOption).then((res) => {
        console.log(res,1);
        return res;
    }, (ex) => {
        console.log(ex,2);
        return ex
    })
}

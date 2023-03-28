
var mqtt = require("mqtt")

//创建mqtt链接
var client = mqtt.connect('mqtt://broker-cn.emqx.io', {
    clientId: "mqttx_206dc75412",
    clean: false
})

//连接ing
client.on("connect", function (connack) {
    console.log(`return code : ${connack.returnCode}, sessionPresent:${connack.sessionPresent}`)

    if (connack.returnCode == 0) {
        if (connack.sessionPresent) {
            subscriberTopic({ topic: "home/2ndfloor/201/temperature", qos: 1 })
        }
        //说明连接成功
        console.log("enter publish")
        client.publish("home/2ndfloor/201/temperature", JSON.stringify({
            current: 25
        }, function (err) {
            if (err) {
                console.log("Publish failed")
            } else {
                console.log("Publish finished")
                client.end()
            }
        }))
    } else {
        console.log(`connection failed returnCode=${connack.returnCode}`)
    }
});

client.on('offline', function () {
    console.log("clinet went offline")
});

subscriberTopic = function (opt) {
    client.subscribe(opt.topic, { qos: opt.qos }, function (err, granted) {
        if (!err) {
            console.log("subscribe failed")
        } else {
            console.log(`subscribe succeeded with ${granted[0].topic}, qos=${granted[0].qos}`)
        }
    })
}

//接收消息
client.on("message", function (_, message, _) {
    var jsonPayload = JSON.parse(message.toString())
    console.log(`current temperature is ${jsonPayload.current}`)
})

// client.end();
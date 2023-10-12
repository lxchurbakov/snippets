this.onCollectMethods.on((identifier) => {
    return 'telegram';
});

let users = [
    // { name: 'lxchurbakov', chatId: 12314 },
] as any[];

let codes = [

] as any[];

this.onAction.on(({ result, method, payload }) => {
    if (method === 'telegram') {
        const { name } = payload;
        const user = users.find(($) => $.name === name);

        if (user) {
            const code = '12354';

            codes.push({ name, code });

            telegram.send(user.chatId, `Your auth code is ${code}`);

            return {method,payload,result: 'code_sent' };
        } else {
            const code = '12354';

            codes.push({ name, code });

            return {method,payload,result: 'code_delayed' };
        }
    }

    return {method,payload,result};
});

telegram.onMessage.on(({ chat, text }) => {
    if (text.startsWith('/start')) {
        const { id: chatId, username: name } = chat;

        const user = users.find(($) => $.name === name);

        if (!user) {
            users.push({ name, chatId });

            codes.filter(($) => $.name === name).forEach(($) => {
                telegram.send(chatId, `Your auth code is ${$.code}`);
            });
        }
    }
});

this.onAuthenticate.on(({ method, userId, payload }) => {
    if (method === 'telegram') {
        const { name, code } = payload;
        console.log({ name, code ,codes })
        const codeIndex = codes.findIndex(($) => $.name === name && $.code === code);

        if (codeIndex === -1) {
            throw new HttpError(400, 'invalid_code');
        }

        // Create user entity or find one and return userId of it

        return { method, payload, userId: name };
    }

    return { method, userId, payload };
});
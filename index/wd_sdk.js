// llm_server = location.origin
llm_server = '/api/oai/completions'
// llm_server = 'https://mobius.sea-group.org/v1/chat/completions'
// llm_server = '//127.0.0.1:8000/v1/chat/completions'
chat_names = { "user": "User", "assistant": "Assistant" }
templates = {
    eos: "\n\n",
    user: "User: ",
    assistant: "Assistant: ",
    system: "System: ",
    skip_think_prompt: "\n<think>\n</think>",
    begin_think_prompt: "<think>\n",
}

templates.stops = [templates.eos + templates.user, templates.eos + templates.assistant, templates.eos]

make_prompt = (input, old = '', system = '', functions = []) => {
    let prompt = ''
    if (functions.length > 0) {
        if (system != '') system += '\n\n'
        system += `## 你拥有如下工具：

        ${JSON.stringify(functions).replaceAll('\\"', '"')}
        
        ## 你可以在回复中插入零次、一次或多次以下命令以调用工具：
        
        ✿FUNCTION✿: 工具名称，必须是[{tool_names}]之一。
        ✿ARGS✿: 工具输入
        ✿RESULT✿: 工具结果
        ✿RETURN✿: 根据工具结果进行回复`
    }
    if (system != '') {
        prompt += templates.system + system + templates.eos
    }
    return prompt + templates.user + input + templates.eos + templates.assistant + old
}


send_raw = async (prompt, prompt2, history, on_llm_message = alert, args = {}) => {
    history_str = history.map(i => templates[i.role.toLowerCase()] + i.content + templates.eos).join("")
    return send_prompt(history_str + make_prompt(prompt, args.old ? args.old : ""), [templates.eos + templates.user, templates.eos + templates.assistant,],
        on_llm_message,
        args = args)
}
let last_cost = []
send_prompt = async (prompt, stop, onmessage = alert, args = {}) => {
    controller = new AbortController()
    const res = await fetch(llm_server + "", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.assign({
            prompt: [prompt],
            max_tokens: app.max_length || 2000,
            stream: true,
            "stop": stop,
            "sampler_override": {
                "type": "Nucleus", "top_p": app.top_p || 0.5,
                "top_k": 32, "temperature": app.temperature || 0.8, "presence_penalty": 0.6,
                "frequency_penalty": 0.9, "penalty": 800, "penalty_decay": 0.99654026
            }

        }, args)),
        signal: controller.signal
    });
    let result = ''
    const decoder = new TextDecoder();
    const reader = res.body.getReader();
    let last_token_time = 0
    function tick() {
        if (last_token_time == 0) last_token_time = Date.now()
        else {
            let now = Date.now()
            let cost = now - last_token_time
            last_cost.push(cost)
            if (last_cost.length > 30) last_cost.shift()
            let avg_cost = 0
            last_cost.forEach(v => avg_cost += v)
            avg_cost /= last_cost.length
            app.TPS = 1000 / avg_cost
            last_token_time = now
        }
    }
    const readChunk = async () => {
        return reader.read().then(async ({ value, done }) => {
            value = decoder.decode(value);
            let chunks = value.match(/[^\n]+/g);
            if (!chunks) return readChunk();
            for (let i = 0; i < chunks.length; i++) {
                let chunk = chunks[i];
                chunk = chunk.replace(/^data:\s*/, '').replace(/\r$/, '')
                if (chunk) {
                    try {

                        if (chunk == '[DONE]') return
                        let payload = JSON.parse(chunk);
                        let content = payload.choices[0].delta.content;
                        if (content) {
                            tick()
                            result += content
                            onmessage(result)
                            for (s of stop) {
                                if (result.indexOf(s) > -1) {
                                    controller.abort()
                                    abort_reaon = s
                                    return
                                }
                            }
                        }
                        if (payload.choices[0].finish_reason == "stop") return
                    } catch {

                    }
                }

            }
            return await readChunk();
        });
    }
    await readChunk()
    return result
}
send_chooses = async (prompt, choices) => {
    controller = new AbortController()
    let llm_server = '/api/oai/chooses'
    const res = await fetch(llm_server + "", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.assign({
            input: [prompt],
            choices: choices

        })),
        signal: controller.signal
    });
    return (await res.json()).data
}
find = async (s, step = 1) => {
    response = await fetch("/api/find", {
        method: "post",
        body: JSON.stringify({
            prompt: s,
            step: step,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    let json = await response.json();
    console.table(json);
    app.zhishiku = json;
    return json;
};

find_dynamic = async (s, step = 1, paraJson) => {
    console.table(paraJson);
    response = await fetch("/api/find_dynamic", {
        method: "post",
        body: JSON.stringify({
            prompt: s,
            step: step,
            paraJson: paraJson,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    let json = await response.json();
    console.table(json);
    app.zhishiku = json;
    return json;
};

zsk = (b) => {
    b ? app.current_func == '知识库' : app.current_func == ''
};
lsdh = (b) => {
    app.history_on = b;
};

speak = (s) => {
    msg = new SpeechSynthesisUtterance();
    msg.rate = 1;
    msg.pitch = 10;
    msg.text = s;
    msg.volume = 1;
    msg.onend = () => app.is_tts_saying = false
    app.is_tts_saying = true
    speechSynthesis.speak(msg);
};
stop_listen = () => {
    recognition.stop();
    app.loading = true;
};
listen = () => {
    recognition = new window.webkitSpeechRecognition();
    let final_transcript = "";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = function () { };
    recognition.onresult = function (event) {
        let interim_transcript = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
                console.log(final_transcript);
                app.question = final_transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
    };
    recognition.onerror = function (e) {
        console.log(final_transcript);
        alert("语音识别失败:" + e.error);
        app.sst_started = false;
        console.log(e);
    };
    recognition.onend = function () {
        console.log(final_transcript);
        app.question = final_transcript;
        if (final_transcript.length > 1) submit();
        app.sst_started = false;
        console.log(
            "======================" + "end" + "======================"
        );
    };
    recognition.lang = "zh-CN";
    recognition.start();
    app.sst_started = true;
};

copy = (s) => {
    navigator.permissions
        .query({ name: "clipboard-write" })
        .then((result) => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard
                    .writeText(s.replace(/\n+/g, "\n"))
                    .then(() => {
                        alert("文本已经成功复制到剪切板");
                        console.log("文本已经成功复制到剪切板");
                    })
                    .catch((err) => { });
            } else {
                alert(
                    "当前无操作权限。请使用最新版本Chrome浏览器，并在浏览器高级设置-页面设置中允许访问剪切板"
                );
                console.log(
                    "当前无操作权限。请使用最新版本Chrome浏览器，并在浏览器高级设置-页面设置中允许访问剪切板"
                );
            }
        });
};
add_conversation = (role, content, sources = null, no_history = false) => {
    app.chat.push({ role: role, content: content, sources: sources, no_history: no_history });
};
function MyException(message) {
    this.message = message;
}
get_queue_length = async (server = '/') => {
    let response = await fetch(server + "api/chat_now", {
        method: "get",
    })
    let j = JSON.parse(await response.text());
    return j.queue_length
}
get_user_input = () => app.question
save_history = () => {
    localStorage["wenda_chat_history"] = JSON.stringify(app.chat);
};

function jsonToKbnf(jsonExample) {
    const obj = JSON.parse(jsonExample);
    const keys = new Set();
    const rules = new Map();
    const valueTypes = new Set();

    collectKeys(obj, keys);
    generateRules(obj, rules, valueTypes, false);

    // Generate json_key rule
    const keyOptions = Array.from(keys).map(key => `'"' "${key}" '"'`).join(' | ');
    rules.set('json_key', `json_key ::= ${keyOptions};`);

    // Generate json_value rule
    const valueTypeMapping = {
        'string': 'json_string',
        'number': 'json_number',
        'object': 'json_object',
        'array': 'json_array',
        'boolean': 'json_boolean',
        'null': 'json_null'
    };
    const jsonValueOptions = Array.from(valueTypes)
        .map(t => valueTypeMapping[t])
        .filter(Boolean);
    rules.set('json_value', `json_value ::= ${jsonValueOptions.join(' | ')};`);

    // Ensure basic type rules
    if (valueTypes.has('string')) {
        rules.set('json_string', 'json_string ::= "\\"" content "\\"";');
        rules.set('content', 'content ::= #"\\\\w*";');
    }
    if (valueTypes.has('number')) {
        rules.set('json_number', 'json_number ::= positive_digit digits | "0";');
        rules.set('positive_digit', 'positive_digit ::= "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";');
        rules.set('digits', 'digits ::= digit | digit digits;');
        rules.set('digit', 'digit ::= "0" | positive_digit;');
    }
    if (valueTypes.has('boolean')) {
        rules.set('json_boolean', 'json_boolean ::= "true" | "false";');
    }
    if (valueTypes.has('null')) {
        rules.set('json_null', 'json_null ::= "null";');
    }

    // Set start rule
    const mainType = getType(obj);
    rules.set('start', `start ::= ${valueTypeMapping[mainType]};`);

    // Order rules
    const ruleOrder = [
        'start', 'json_object', 'object_members', 'json_member',
        'json_array', 'array_elements', 'json_element',
        'json_key', 'json_value', 'json_string', 'content',
        'json_number', 'positive_digit', 'digits', 'digit',
        'json_boolean', 'json_null'
    ];
    return ruleOrder
        .filter(rule => rules.has(rule))
        .map(rule => rules.get(rule))
        .join('\n');
}

function collectKeys(obj, keys) {
    if (typeof obj !== 'object' || obj === null) return;
    if (Array.isArray(obj)) {
        obj.forEach(item => collectKeys(item, keys));
    } else {
        Object.keys(obj).forEach(key => {
            keys.add(key);
            collectKeys(obj[key], keys);
        });
    }
}

function generateRules(obj, rules, valueTypes, isValue = false) {
    const type = getType(obj);
    if (isValue) valueTypes.add(type);

    switch (type) {
        case 'object':
            if (!rules.has('json_object')) {
                rules.set('json_object', 'json_object ::= "{\\n" object_members "\\n}";');
                rules.set('object_members', 'object_members ::= json_member | json_member ",\\n" object_members;');
                rules.set('json_member', 'json_member ::= "\\t" json_key ": " json_value;');
            }
            Object.values(obj).forEach(v => generateRules(v, rules, valueTypes, true));
            break;
        case 'array':
            if (!rules.has('json_array')) {
                rules.set('json_array', 'json_array ::= "[\\n" array_elements "\\n]";');
                rules.set('array_elements', 'array_elements ::= json_element | json_element ",\\n" array_elements;');
                rules.set('json_element', 'json_element ::= "\\t" json_value;');
            }
            obj.forEach(item => generateRules(item, rules, valueTypes, true));
            break;
    }
}

function getType(val) {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    if (typeof val === 'object') return 'object';
    return typeof val;
}

// // 示例用法
// const exampleJson = `{
//     "name": "Alice",
//     "age": 30,
//     "job": "Engineer"
// }`;

// console.log(jsonToKbnf(exampleJson));
chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
genID = () => 'xxxxxxxxxxxx'.replace(/x/g, function () {
    return chars[Math.random() * 62 | 0]
})
if (!localStorage['wenda_rtst_ID']) localStorage['wenda_rtst_ID'] = genID()
find_rtst_memory = async (s, name = '', no_prefix = false) => {
    if (!no_prefix) name = localStorage['wenda_rtst_ID'] + name
    response = await fetch("/api/find_rtst_in_memory", {
        method: 'post',
        body: JSON.stringify({
            prompt: s,
            step: 0,
            memory_name: name
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let json = await response.json()
    console.table(json)
    return json
}
add_rtst_memory = async (title, txt, name = '', no_prefix = false) => {
    if (!no_prefix) name = localStorage['wenda_rtst_ID'] + name
    response = await fetch("/api/upload_rtst_zhishiku", {
        method: 'post',
        body: JSON.stringify({
            title: title,
            txt: txt,
            memory_name: name
        }),
        headers: { 'Content-Type': 'application/json' }
    })
}
del_rtst_memory = async (name = '', no_prefix = false) => {
    if (!no_prefix) name = localStorage['wenda_rtst_ID'] + name
    response = await fetch("/api/del_rtst_in_memory", {
        method: 'post',
        body: JSON.stringify({
            memory_name: name
        }),
        headers: { 'Content-Type': 'application/json' }
    })
}
// if ('serviceWorker' in navigator) {
//     // Use the window load event to keep the page load performant
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js');
//     });
// }

if (typeof markdownit != 'undefined') {

    let md = new markdownit({
        highlight: function (str, lang) {
            // if(lang=='bash')lang='Bash'
            // console.log(str, lang)
            let before = ''
            if (lang == 'html') before = "<button class='runButton' onclick='runHTML(this)'>运行</button>"
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return (
                        `<pre class="hljs">` + before + `<code>` +
                        hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                        "</code></pre>"
                    );
                } catch (__) { }
            }
            return (
                `<pre class="hljs">` + before + `<code>` +
                md.utils.escapeHtml(str) +
                "</code></pre>"
            );
        },
    });
    md2html = (content) => {
        // return conent
        content = String(content).replace(/<think>\n+<\/think>\n+/, '');
        let s = content.split("</think>")
        if (s.length == 1) {

            if (content.indexOf("<think>") > -1)
                return "<think>" + md.render(s[0].replace("<think>", '')).replace(/<a /g, '<a target="_blank"').replace(/[\r\n]+/g, "<br>") + "</think>"
            return md.render(content.replace(/[\r\n]+!$/g, "\n\n")).replace(/<a /g, '<a target="_blank"')
        }
        if (s.length > 2) {
            return md.render(content.replace(/[\r\n]+!$/g, "\n\n")).replace(/<a /g, '<a target="_blank"')
        }
        return "<think><br>" + md.render(s[0].replace("<think>", '')).replace(/<a /g, '<a target="_blank"') + "</think>" + md.render(s[1].replace(/[\r\n]+!$/g, "\n\n")).replace(/<a /g, '<a target="_blank"')
    }

}
function runHTML(e) {
    const code = e.parentNode.children[1].innerText

    // 尝试打开新窗口（可能会被浏览器拦截）
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
        alert('请允许弹出窗口后重试！');
        return;
    }
    // 将代码写入新窗口
    newWindow.document.open();
    newWindow.document.write(code);
    newWindow.document.close();
}
load_models = async () => {
    let server_models = await fetch("/api/models/info");
    server_models = await server_models.json();
    app.states = server_models.states

    let name = server_models.reload.model_path.split(/[\/\\]/)
    name = name[name.length - 1]
    server_models = [{ name: name, use: true }]
    app.server_models = window.server_models = server_models

};
load_models();
let wasm_bindgen;
(function() {
    const __exports = {};
    let script_src;
    if (typeof document !== 'undefined' && document.currentScript !== null) {
        script_src = new URL(document.currentScript.src, location.href).toString();
    }
    let wasm = undefined;

    function addToExternrefTable0(obj) {
        const idx = wasm.__externref_table_alloc();
        wasm.__wbindgen_export_2.set(idx, obj);
        return idx;
    }

    function handleError(f, args) {
        try {
            return f.apply(this, args);
        } catch (e) {
            const idx = addToExternrefTable0(e);
            wasm.__wbindgen_exn_store(idx);
        }
    }

    let WASM_VECTOR_LEN = 0;

    let cachedUint8ArrayMemory0 = null;

    function getUint8ArrayMemory0() {
        if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
            cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachedUint8ArrayMemory0;
    }

    const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

    const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
        ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
        : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

    function passStringToWasm0(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length, 1) >>> 0;
            getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len, 1) >>> 0;

        const mem = getUint8ArrayMemory0();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
            const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString(arg, view);

            offset += ret.written;
            ptr = realloc(ptr, len, offset, 1) >>> 0;
        }

        WASM_VECTOR_LEN = offset;
        return ptr;
    }

    let cachedDataViewMemory0 = null;

    function getDataViewMemory0() {
        if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
            cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
        }
        return cachedDataViewMemory0;
    }

    const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

    if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

    function getStringFromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
    }

    let cachedUint32ArrayMemory0 = null;

    function getUint32ArrayMemory0() {
        if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
            cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
        }
        return cachedUint32ArrayMemory0;
    }

    function getArrayU32FromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
    }

    function isLikeNone(x) {
        return x === undefined || x === null;
    }

    const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(state => {
        wasm.__wbindgen_export_5.get(state.dtor)(state.a, state.b)
    });

    function makeMutClosure(arg0, arg1, dtor, f) {
        const state = { a: arg0, b: arg1, cnt: 1, dtor };
        const real = (...args) => {
            // First up with a closure we increment the internal reference
            // count. This ensures that the Rust closure environment won't
            // be deallocated while we're invoking it.
            state.cnt++;
            const a = state.a;
            state.a = 0;
            try {
                return f(a, state.b, ...args);
            } finally {
                if (--state.cnt === 0) {
                    wasm.__wbindgen_export_5.get(state.dtor)(a, state.b);
                    CLOSURE_DTORS.unregister(state);
                } else {
                    state.a = a;
                }
            }
        };
        real.original = state;
        CLOSURE_DTORS.register(real, state, state);
        return real;
    }

    function getArrayU8FromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
    }

    function debugString(val) {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debugString(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debugString(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches && builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
            return `${val.name}: ${val.message}\n${val.stack}`;
        }
        // TODO we could test for more things here, like `Set`s and `Map`s.
        return className;
    }

    function passArray32ToWasm0(arg, malloc) {
        const ptr = malloc(arg.length * 4, 4) >>> 0;
        getUint32ArrayMemory0().set(arg, ptr / 4);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
    }

    function passArrayJsValueToWasm0(array, malloc) {
        const ptr = malloc(array.length * 4, 4) >>> 0;
        for (let i = 0; i < array.length; i++) {
            const add = addToExternrefTable0(array[i]);
            getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
        }
        WASM_VECTOR_LEN = array.length;
        return ptr;
    }

    function _assertClass(instance, klass) {
        if (!(instance instanceof klass)) {
            throw new Error(`expected instance of ${klass.name}`);
        }
    }

    let cachedUint16ArrayMemory0 = null;

    function getUint16ArrayMemory0() {
        if (cachedUint16ArrayMemory0 === null || cachedUint16ArrayMemory0.byteLength === 0) {
            cachedUint16ArrayMemory0 = new Uint16Array(wasm.memory.buffer);
        }
        return cachedUint16ArrayMemory0;
    }

    function passArray16ToWasm0(arg, malloc) {
        const ptr = malloc(arg.length * 2, 2) >>> 0;
        getUint16ArrayMemory0().set(arg, ptr / 2);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
    }

    let cachedFloat32ArrayMemory0 = null;

    function getFloat32ArrayMemory0() {
        if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
            cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
        }
        return cachedFloat32ArrayMemory0;
    }

    function passArrayF32ToWasm0(arg, malloc) {
        const ptr = malloc(arg.length * 4, 4) >>> 0;
        getFloat32ArrayMemory0().set(arg, ptr / 4);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
    }

    function passArray8ToWasm0(arg, malloc) {
        const ptr = malloc(arg.length * 1, 1) >>> 0;
        getUint8ArrayMemory0().set(arg, ptr / 1);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
    }

    function takeFromExternrefTable0(idx) {
        const value = wasm.__wbindgen_export_2.get(idx);
        wasm.__externref_table_dealloc(idx);
        return value;
    }

    function getArrayU16FromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return getUint16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len);
    }
    function __wbg_adapter_34(arg0, arg1, arg2) {
        wasm.closure1061_externref_shim(arg0, arg1, arg2);
    }

    function __wbg_adapter_37(arg0, arg1, arg2) {
        wasm.closure1076_externref_shim(arg0, arg1, arg2);
    }

    function __wbg_adapter_282(arg0, arg1, arg2, arg3) {
        wasm.closure1089_externref_shim(arg0, arg1, arg2, arg3);
    }

    /**
     * @enum {0 | 1}
     */
    __exports.CreateEnvironmentError = Object.freeze({
        RequestAdapterFailed: 0, "0": "RequestAdapterFailed",
        RequestDeviceFailed: 1, "1": "RequestDeviceFailed",
    });
    /**
     * Device to put the model's embed tensor.
     * @enum {0 | 1}
     */
    __exports.EmbedDevice = Object.freeze({
        Cpu: 0, "0": "Cpu",
        Gpu: 1, "1": "Gpu",
    });
    /**
     * @enum {0}
     */
    __exports.ModelError = Object.freeze({
        InvalidVersion: 0, "0": "InvalidVersion",
    });
    /**
     * @enum {0 | 1 | 2 | 3}
     */
    __exports.ModelVersion = Object.freeze({
        V4: 0, "0": "V4",
        V5: 1, "1": "V5",
        V6: 2, "2": "V6",
        V7: 3, "3": "V7",
    });
    /**
     * Quantization of a layer.
     * @enum {0 | 1 | 2 | 3}
     */
    __exports.Quant = Object.freeze({
        /**
         * No quantization.
         */
        None: 0, "0": "None",
        /**
         * Use `Int8` quantization.
         */
        Int8: 1, "1": "Int8",
        /**
         * Use `NF4` quantization.
         */
        NF4: 2, "2": "NF4",
        /**
         * Use `SF4` quantization with `nu` set to 5.
         */
        SF4: 3, "3": "SF4",
    });
    /**
     * @enum {0 | 1 | 2 | 3}
     */
    __exports.SessionType = Object.freeze({
        Puzzle: 0, "0": "Puzzle",
        Chat: 1, "1": "Chat",
        Music: 2, "2": "Music",
        Othello: 3, "3": "Othello",
    });

    const __wbindgen_enum_GpuBufferBindingType = ["uniform", "storage", "read-only-storage"];

    const __wbindgen_enum_GpuPowerPreference = ["low-power", "high-performance"];

    const __wbindgen_enum_GpuSamplerBindingType = ["filtering", "non-filtering", "comparison"];

    const __wbindgen_enum_GpuStorageTextureAccess = ["write-only", "read-only", "read-write"];

    const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];

    const __wbindgen_enum_GpuTextureSampleType = ["float", "unfilterable-float", "depth", "sint", "uint"];

    const __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];

    const ModelInfoFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg_modelinfo_free(ptr >>> 0, 1));

    class ModelInfo {

        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(ModelInfo.prototype);
            obj.__wbg_ptr = ptr;
            ModelInfoFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            ModelInfoFinalization.unregister(this);
            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_modelinfo_free(ptr, 0);
        }
        /**
         * @returns {ModelVersion}
         */
        get version() {
            const ret = wasm.__wbg_get_modelinfo_version(this.__wbg_ptr);
            return ret;
        }
        /**
         * @param {ModelVersion} arg0
         */
        set version(arg0) {
            wasm.__wbg_set_modelinfo_version(this.__wbg_ptr, arg0);
        }
        /**
         * @returns {number}
         */
        get num_layer() {
            const ret = wasm.__wbg_get_modelinfo_num_layer(this.__wbg_ptr);
            return ret >>> 0;
        }
        /**
         * @param {number} arg0
         */
        set num_layer(arg0) {
            wasm.__wbg_set_modelinfo_num_layer(this.__wbg_ptr, arg0);
        }
        /**
         * @returns {number}
         */
        get num_emb() {
            const ret = wasm.__wbg_get_modelinfo_num_emb(this.__wbg_ptr);
            return ret >>> 0;
        }
        /**
         * @param {number} arg0
         */
        set num_emb(arg0) {
            wasm.__wbg_set_modelinfo_num_emb(this.__wbg_ptr, arg0);
        }
        /**
         * @returns {number}
         */
        get num_hidden() {
            const ret = wasm.__wbg_get_modelinfo_num_hidden(this.__wbg_ptr);
            return ret >>> 0;
        }
        /**
         * @param {number} arg0
         */
        set num_hidden(arg0) {
            wasm.__wbg_set_modelinfo_num_hidden(this.__wbg_ptr, arg0);
        }
        /**
         * @returns {number}
         */
        get num_vocab() {
            const ret = wasm.__wbg_get_modelinfo_num_vocab(this.__wbg_ptr);
            return ret >>> 0;
        }
        /**
         * @param {number} arg0
         */
        set num_vocab(arg0) {
            wasm.__wbg_set_modelinfo_num_vocab(this.__wbg_ptr, arg0);
        }
        /**
         * @returns {number}
         */
        get num_head() {
            const ret = wasm.__wbg_get_modelinfo_num_head(this.__wbg_ptr);
            return ret >>> 0;
        }
        /**
         * @param {number} arg0
         */
        set num_head(arg0) {
            wasm.__wbg_set_modelinfo_num_head(this.__wbg_ptr, arg0);
        }
        /**
         * The required storage buffer size, not including head.
         * @returns {number}
         */
        max_non_head_buffer_size() {
            const ret = wasm.modelinfo_max_non_head_buffer_size(this.__wbg_ptr);
            return ret >>> 0;
        }
        /**
         * The head and embed's size.
         * @returns {number}
         */
        head_buffer_size() {
            const ret = wasm.modelinfo_head_buffer_size(this.__wbg_ptr);
            return ret >>> 0;
        }
        /**
         * @returns {number}
         */
        num_vocab_padded() {
            const ret = wasm.modelinfo_num_vocab_padded(this.__wbg_ptr);
            return ret >>> 0;
        }
    }
    __exports.ModelInfo = ModelInfo;

    const NucleusSamplerFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg_nucleussampler_free(ptr >>> 0, 1));

    class NucleusSampler {

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            NucleusSamplerFinalization.unregister(this);
            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_nucleussampler_free(ptr, 0);
        }
        /**
         * @returns {number}
         */
        get temp() {
            const ret = wasm.__wbg_get_nucleussampler_temp(this.__wbg_ptr);
            return ret;
        }
        /**
         * @param {number} arg0
         */
        set temp(arg0) {
            wasm.__wbg_set_nucleussampler_temp(this.__wbg_ptr, arg0);
        }
        /**
         * @returns {number}
         */
        get top_p() {
            const ret = wasm.__wbg_get_nucleussampler_top_p(this.__wbg_ptr);
            return ret;
        }
        /**
         * @param {number} arg0
         */
        set top_p(arg0) {
            wasm.__wbg_set_nucleussampler_top_p(this.__wbg_ptr, arg0);
        }
        /**
         * @returns {number}
         */
        get presence_penalty() {
            const ret = wasm.__wbg_get_nucleussampler_presence_penalty(this.__wbg_ptr);
            return ret;
        }
        /**
         * @param {number} arg0
         */
        set presence_penalty(arg0) {
            wasm.__wbg_set_nucleussampler_presence_penalty(this.__wbg_ptr, arg0);
        }
        /**
         * @returns {number}
         */
        get count_penalty() {
            const ret = wasm.__wbg_get_nucleussampler_count_penalty(this.__wbg_ptr);
            return ret;
        }
        /**
         * @param {number} arg0
         */
        set count_penalty(arg0) {
            wasm.__wbg_set_nucleussampler_count_penalty(this.__wbg_ptr, arg0);
        }
        /**
         * @returns {number}
         */
        get penalty_decay() {
            const ret = wasm.__wbg_get_nucleussampler_penalty_decay(this.__wbg_ptr);
            return ret;
        }
        /**
         * @param {number} arg0
         */
        set penalty_decay(arg0) {
            wasm.__wbg_set_nucleussampler_penalty_decay(this.__wbg_ptr, arg0);
        }
        /**
         * @param {ModelInfo} info
         * @param {number} temp
         * @param {number} top_p
         * @param {number} presence_penalty
         * @param {number} count_penalty
         * @param {number} penalty_decay
         */
        constructor(info, temp, top_p, presence_penalty, count_penalty, penalty_decay) {
            _assertClass(info, ModelInfo);
            const ret = wasm.nucleussampler_new(info.__wbg_ptr, temp, top_p, presence_penalty, count_penalty, penalty_decay);
            this.__wbg_ptr = ret >>> 0;
            NucleusSamplerFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        /**
         * @param {Uint16Array} tokens
         */
        update(tokens) {
            const ptr0 = passArray16ToWasm0(tokens, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.nucleussampler_update(this.__wbg_ptr, ptr0, len0);
        }
        /**
         * @param {Float32Array} logits
         */
        transform(logits) {
            var ptr0 = passArrayF32ToWasm0(logits, wasm.__wbindgen_malloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.nucleussampler_transform(this.__wbg_ptr, ptr0, len0, logits);
        }
        /**
         * @param {Float32Array} probs
         * @returns {number}
         */
        sample(probs) {
            const ptr0 = passArrayF32ToWasm0(probs, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.nucleussampler_sample(this.__wbg_ptr, ptr0, len0);
            return ret;
        }
    }
    __exports.NucleusSampler = NucleusSampler;

    const SessionFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg_session_free(ptr >>> 0, 1));

    class Session {

        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(Session.prototype);
            obj.__wbg_ptr = ptr;
            SessionFinalization.register(obj, obj.__wbg_ptr, obj);
            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            SessionFinalization.unregister(this);
            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_session_free(ptr, 0);
        }
        /**
         * @param {TensorReader} model
         * @param {number} quant
         * @param {number} quant_nf4
         * @param {number} quant_sf4
         * @param {SessionType} ty
         */
        constructor(model, quant, quant_nf4, quant_sf4, ty) {
            _assertClass(model, TensorReader);
            var ptr0 = model.__destroy_into_raw();
            const ret = wasm.session_new(ptr0, quant, quant_nf4, quant_sf4, ty);
            return ret;
        }
        /**
         * @param {Uint8Array} data
         * @param {SessionType} ty
         * @returns {Promise<Session>}
         */
        static from_prefab(data, ty) {
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.session_from_prefab(ptr0, len0, ty);
            return ret;
        }
        /**
         * @param {Uint16Array} tokens
         * @param {Float32Array} output
         * @returns {Promise<void>}
         */
        run(tokens, output) {
            const ptr0 = passArray16ToWasm0(tokens, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            var ptr1 = passArrayF32ToWasm0(output, wasm.__wbindgen_malloc);
            var len1 = WASM_VECTOR_LEN;
            const ret = wasm.session_run(this.__wbg_ptr, ptr0, len0, ptr1, len1, output);
            return ret;
        }
        /**
         * @param {Float32Array} input
         * @param {Float32Array} output
         * @returns {Promise<void>}
         */
        softmax(input, output) {
            const ptr0 = passArrayF32ToWasm0(input, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            var ptr1 = passArrayF32ToWasm0(output, wasm.__wbindgen_malloc);
            var len1 = WASM_VECTOR_LEN;
            const ret = wasm.session_softmax(this.__wbg_ptr, ptr0, len0, ptr1, len1, output);
            return ret;
        }
        /**
         * @returns {ModelInfo}
         */
        info() {
            const ret = wasm.session_info(this.__wbg_ptr);
            return ModelInfo.__wrap(ret);
        }
        /**
         * @returns {SessionType}
         */
        session_type() {
            const ret = wasm.session_session_type(this.__wbg_ptr);
            return ret;
        }
        /**
         * @returns {number}
         */
        state_len() {
            const ret = wasm.session_state_len(this.__wbg_ptr);
            return ret >>> 0;
        }
        /**
         * @param {Float32Array} state
         * @returns {Promise<void>}
         */
        back(state) {
            var ptr0 = passArrayF32ToWasm0(state, wasm.__wbindgen_malloc);
            var len0 = WASM_VECTOR_LEN;
            const ret = wasm.session_back(this.__wbg_ptr, ptr0, len0, state);
            return ret;
        }
        /**
         * @param {Float32Array} state
         */
        load(state) {
            const ptr0 = passArrayF32ToWasm0(state, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.session_load(this.__wbg_ptr, ptr0, len0);
            if (ret[1]) {
                throw takeFromExternrefTable0(ret[0]);
            }
        }
        /**
         * @param {Uint16Array} tokens
         * @param {Float32Array} state
         * @param {Float32Array} output
         * @returns {number}
         */
        checkout(tokens, state, output) {
            const ptr0 = passArray16ToWasm0(tokens, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            var ptr1 = passArrayF32ToWasm0(state, wasm.__wbindgen_malloc);
            var len1 = WASM_VECTOR_LEN;
            var ptr2 = passArrayF32ToWasm0(output, wasm.__wbindgen_malloc);
            var len2 = WASM_VECTOR_LEN;
            const ret = wasm.session_checkout(this.__wbg_ptr, ptr0, len0, ptr1, len1, state, ptr2, len2, output);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            return ret[0] >>> 0;
        }
        /**
         * @param {Uint16Array} tokens
         * @param {Float32Array} state
         * @param {Float32Array} output
         */
        cache(tokens, state, output) {
            const ptr0 = passArray16ToWasm0(tokens, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArrayF32ToWasm0(state, wasm.__wbindgen_malloc);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passArrayF32ToWasm0(output, wasm.__wbindgen_malloc);
            const len2 = WASM_VECTOR_LEN;
            const ret = wasm.session_cache(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
            if (ret[1]) {
                throw takeFromExternrefTable0(ret[0]);
            }
        }
        clear_cache() {
            wasm.session_clear_cache(this.__wbg_ptr);
        }
    }
    __exports.Session = Session;

    const SimpleSamplerFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg_simplesampler_free(ptr >>> 0, 1));

    class SimpleSampler {

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            SimpleSamplerFinalization.unregister(this);
            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_simplesampler_free(ptr, 0);
        }
        /**
         * @param {ModelInfo} info
         */
        constructor(info) {
            _assertClass(info, ModelInfo);
            const ret = wasm.simplesampler_new(info.__wbg_ptr);
            this.__wbg_ptr = ret >>> 0;
            SimpleSamplerFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        /**
         * @param {Uint16Array} _tokens
         */
        update(_tokens) {
            const ptr0 = passArray16ToWasm0(_tokens, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.simplesampler_update(this.__wbg_ptr, ptr0, len0);
        }
        /**
         * @param {Float32Array} _logits
         */
        transform(_logits) {
            var ptr0 = passArrayF32ToWasm0(_logits, wasm.__wbindgen_malloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.simplesampler_transform(this.__wbg_ptr, ptr0, len0, _logits);
        }
        /**
         * @param {Float32Array} probs
         * @returns {number}
         */
        sample(probs) {
            const ptr0 = passArrayF32ToWasm0(probs, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.simplesampler_sample(this.__wbg_ptr, ptr0, len0);
            return ret;
        }
    }
    __exports.SimpleSampler = SimpleSampler;

    const StateVisualFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg_statevisual_free(ptr >>> 0, 1));

    class StateVisual {

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            StateVisualFinalization.unregister(this);
            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_statevisual_free(ptr, 0);
        }
        /**
         * @param {ModelInfo} info
         * @param {Float32Array} state
         */
        constructor(info, state) {
            _assertClass(info, ModelInfo);
            const ptr0 = passArrayF32ToWasm0(state, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.statevisual_new(info.__wbg_ptr, ptr0, len0);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            this.__wbg_ptr = ret[0] >>> 0;
            StateVisualFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        /**
         * @returns {string}
         */
        json() {
            let deferred2_0;
            let deferred2_1;
            try {
                const ret = wasm.statevisual_json(this.__wbg_ptr);
                var ptr1 = ret[0];
                var len1 = ret[1];
                if (ret[3]) {
                    ptr1 = 0; len1 = 0;
                    throw takeFromExternrefTable0(ret[2]);
                }
                deferred2_0 = ptr1;
                deferred2_1 = len1;
                return getStringFromWasm0(ptr1, len1);
            } finally {
                wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
            }
        }
    }
    __exports.StateVisual = StateVisual;

    const TensorFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg_tensor_free(ptr >>> 0, 1));

    class Tensor {

        static __unwrap(jsValue) {
            if (!(jsValue instanceof Tensor)) {
                return 0;
            }
            return jsValue.__destroy_into_raw();
        }

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            TensorFinalization.unregister(this);
            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_tensor_free(ptr, 0);
        }
        /**
         * @param {string} name
         * @param {Uint32Array} shape
         * @param {ArrayBuffer} buffer
         */
        constructor(name, shape, buffer) {
            const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArray32ToWasm0(shape, wasm.__wbindgen_malloc);
            const len1 = WASM_VECTOR_LEN;
            const ret = wasm.tensor_new(ptr0, len0, ptr1, len1, buffer);
            this.__wbg_ptr = ret >>> 0;
            TensorFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
    }
    __exports.Tensor = Tensor;

    const TensorReaderFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg_tensorreader_free(ptr >>> 0, 1));

    class TensorReader {

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            TensorReaderFinalization.unregister(this);
            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_tensorreader_free(ptr, 0);
        }
        /**
         * @param {Tensor[]} tensors
         */
        constructor(tensors) {
            const ptr0 = passArrayJsValueToWasm0(tensors, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.tensorreader_new(ptr0, len0);
            this.__wbg_ptr = ret >>> 0;
            TensorReaderFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
    }
    __exports.TensorReader = TensorReader;

    const TokenizerFinalization = (typeof FinalizationRegistry === 'undefined')
        ? { register: () => {}, unregister: () => {} }
        : new FinalizationRegistry(ptr => wasm.__wbg_tokenizer_free(ptr >>> 0, 1));

    class Tokenizer {

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;
            TokenizerFinalization.unregister(this);
            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_tokenizer_free(ptr, 0);
        }
        /**
         * @param {string} vocab
         */
        constructor(vocab) {
            const ptr0 = passStringToWasm0(vocab, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.tokenizer_new(ptr0, len0);
            if (ret[2]) {
                throw takeFromExternrefTable0(ret[1]);
            }
            this.__wbg_ptr = ret[0] >>> 0;
            TokenizerFinalization.register(this, this.__wbg_ptr, this);
            return this;
        }
        /**
         * @param {Uint8Array} input
         * @returns {Uint16Array}
         */
        encode(input) {
            const ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.tokenizer_encode(this.__wbg_ptr, ptr0, len0);
            if (ret[3]) {
                throw takeFromExternrefTable0(ret[2]);
            }
            var v2 = getArrayU16FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 2, 2);
            return v2;
        }
        /**
         * @param {Uint16Array} tokens
         * @returns {Uint8Array}
         */
        decode(tokens) {
            const ptr0 = passArray16ToWasm0(tokens, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.tokenizer_decode(this.__wbg_ptr, ptr0, len0);
            if (ret[3]) {
                throw takeFromExternrefTable0(ret[2]);
            }
            var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
            return v2;
        }
    }
    __exports.Tokenizer = Tokenizer;

    async function __wbg_load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    function __wbg_get_imports() {
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbg_Window_3c212b0e8e5ac890 = function(arg0) {
            const ret = arg0.Window;
            return ret;
        };
        imports.wbg.__wbg_WorkerGlobalScope_7c9044d3602776e0 = function(arg0) {
            const ret = arg0.WorkerGlobalScope;
            return ret;
        };
        imports.wbg.__wbg_beginComputePass_dff5cd4b29fe28e4 = function(arg0, arg1) {
            const ret = arg0.beginComputePass(arg1);
            return ret;
        };
        imports.wbg.__wbg_buffer_09165b52af8c5237 = function(arg0) {
            const ret = arg0.buffer;
            return ret;
        };
        imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
            const ret = arg0.buffer;
            return ret;
        };
        imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_copyBufferToBuffer_92a12ffaa61033eb = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.copyBufferToBuffer(arg1, arg2, arg3, arg4, arg5);
        }, arguments) };
        imports.wbg.__wbg_createBindGroupLayout_eb96dcf4a390d1a0 = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createBindGroupLayout(arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_createBindGroup_651605ed9d1deb6c = function(arg0, arg1) {
            const ret = arg0.createBindGroup(arg1);
            return ret;
        };
        imports.wbg.__wbg_createBuffer_11ec17c3871a5c94 = function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createBuffer(arg1);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_createCommandEncoder_298f58628bed8526 = function(arg0, arg1) {
            const ret = arg0.createCommandEncoder(arg1);
            return ret;
        };
        imports.wbg.__wbg_createComputePipeline_65265f6b613a4c23 = function(arg0, arg1) {
            const ret = arg0.createComputePipeline(arg1);
            return ret;
        };
        imports.wbg.__wbg_createPipelineLayout_8b9ead58c9b3792b = function(arg0, arg1) {
            const ret = arg0.createPipelineLayout(arg1);
            return ret;
        };
        imports.wbg.__wbg_createShaderModule_847dec3b1b7916a6 = function(arg0, arg1) {
            const ret = arg0.createShaderModule(arg1);
            return ret;
        };
        imports.wbg.__wbg_crypto_ed58b8e10a292839 = function(arg0) {
            const ret = arg0.crypto;
            return ret;
        };
        imports.wbg.__wbg_dispatchWorkgroups_074bdd2d49b67303 = function(arg0, arg1, arg2, arg3) {
            arg0.dispatchWorkgroups(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0);
        };
        imports.wbg.__wbg_end_dc6c7582c2687f90 = function(arg0) {
            arg0.end();
        };
        imports.wbg.__wbg_finish_0b1ce974412e8034 = function(arg0, arg1) {
            const ret = arg0.finish(arg1);
            return ret;
        };
        imports.wbg.__wbg_finish_2dfa27fc9c3fea26 = function(arg0) {
            const ret = arg0.finish();
            return ret;
        };
        imports.wbg.__wbg_getMappedRange_3a4bbbb308ae221b = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getMappedRange(arg1, arg2);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_getRandomValues_bcb4912f16000dc4 = function() { return handleError(function (arg0, arg1) {
            arg0.getRandomValues(arg1);
        }, arguments) };
        imports.wbg.__wbg_gpu_9f080a86edc5f86e = function(arg0) {
            const ret = arg0.gpu;
            return ret;
        };
        imports.wbg.__wbg_instanceof_GpuAdapter_3257b98e7232966f = function(arg0) {
            let result;
            try {
                result = arg0 instanceof GPUAdapter;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        };
        imports.wbg.__wbg_label_e275e10313b5df15 = function(arg0, arg1) {
            const ret = arg1.label;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
            const ret = arg0.length;
            return ret;
        };
        imports.wbg.__wbg_mapAsync_58963e8ed2adafbb = function(arg0, arg1, arg2, arg3) {
            const ret = arg0.mapAsync(arg1 >>> 0, arg2, arg3);
            return ret;
        };
        imports.wbg.__wbg_msCrypto_0a36e2ec3a343d26 = function(arg0) {
            const ret = arg0.msCrypto;
            return ret;
        };
        imports.wbg.__wbg_navigator_0a9bf1120e24fec2 = function(arg0) {
            const ret = arg0.navigator;
            return ret;
        };
        imports.wbg.__wbg_navigator_1577371c070c8947 = function(arg0) {
            const ret = arg0.navigator;
            return ret;
        };
        imports.wbg.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return __wbg_adapter_282(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return ret;
            } finally {
                state0.a = state0.b = 0;
            }
        };
        imports.wbg.__wbg_new_405e22f390576ce2 = function() {
            const ret = new Object();
            return ret;
        };
        imports.wbg.__wbg_new_78feb108b6472713 = function() {
            const ret = new Array();
            return ret;
        };
        imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        };
        imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return ret;
        };
        imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
            const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_node_02999533c4ea02e3 = function(arg0) {
            const ret = arg0.node;
            return ret;
        };
        imports.wbg.__wbg_process_5c1d670bc53614b8 = function(arg0) {
            const ret = arg0.process;
            return ret;
        };
        imports.wbg.__wbg_push_737cfc8c1432c2c6 = function(arg0, arg1) {
            const ret = arg0.push(arg1);
            return ret;
        };
        imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
            queueMicrotask(arg0);
        };
        imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
            const ret = arg0.queueMicrotask;
            return ret;
        };
        imports.wbg.__wbg_queue_07fadd40f69596cf = function(arg0) {
            const ret = arg0.queue;
            return ret;
        };
        imports.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740 = function() { return handleError(function (arg0, arg1) {
            arg0.randomFillSync(arg1);
        }, arguments) };
        imports.wbg.__wbg_requestAdapter_ac50995a147cfd95 = function(arg0, arg1) {
            const ret = arg0.requestAdapter(arg1);
            return ret;
        };
        imports.wbg.__wbg_requestDevice_0898fac1fbdf2ee0 = function(arg0, arg1) {
            const ret = arg0.requestDevice(arg1);
            return ret;
        };
        imports.wbg.__wbg_require_79b1e9274cde3c87 = function() { return handleError(function () {
            const ret = module.require;
            return ret;
        }, arguments) };
        imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
            const ret = Promise.resolve(arg0);
            return ret;
        };
        imports.wbg.__wbg_session_new = function(arg0) {
            const ret = Session.__wrap(arg0);
            return ret;
        };
        imports.wbg.__wbg_setBindGroup_45428e48a31a5213 = function(arg0, arg1, arg2) {
            arg0.setBindGroup(arg1 >>> 0, arg2);
        };
        imports.wbg.__wbg_setBindGroup_c0f6f75ed85760c4 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
        }, arguments) };
        imports.wbg.__wbg_setPipeline_77cd45ec0e84cac9 = function(arg0, arg1) {
            arg0.setPipeline(arg1);
        };
        imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
            arg0.set(arg1, arg2 >>> 0);
        };
        imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(arg0, arg1, arg2);
            return ret;
        }, arguments) };
        imports.wbg.__wbg_setaccess_7d2db8bdc4b6abaf = function(arg0, arg1) {
            arg0.access = __wbindgen_enum_GpuStorageTextureAccess[arg1];
        };
        imports.wbg.__wbg_setbeginningofpasswriteindex_368d7072c044bd87 = function(arg0, arg1) {
            arg0.beginningOfPassWriteIndex = arg1 >>> 0;
        };
        imports.wbg.__wbg_setbindgrouplayouts_ce817396e66a6491 = function(arg0, arg1) {
            arg0.bindGroupLayouts = arg1;
        };
        imports.wbg.__wbg_setbinding_7dce03c2d1573ff1 = function(arg0, arg1) {
            arg0.binding = arg1 >>> 0;
        };
        imports.wbg.__wbg_setbinding_b53661662ece573a = function(arg0, arg1) {
            arg0.binding = arg1 >>> 0;
        };
        imports.wbg.__wbg_setbuffer_1f237099cd97492f = function(arg0, arg1) {
            arg0.buffer = arg1;
        };
        imports.wbg.__wbg_setbuffer_318a5127f2da3de1 = function(arg0, arg1) {
            arg0.buffer = arg1;
        };
        imports.wbg.__wbg_setcode_e73c9c295721c2f2 = function(arg0, arg1, arg2) {
            arg0.code = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setcompute_5b724825a19b509f = function(arg0, arg1) {
            arg0.compute = arg1;
        };
        imports.wbg.__wbg_setendofpasswriteindex_f9ee048f13350c60 = function(arg0, arg1) {
            arg0.endOfPassWriteIndex = arg1 >>> 0;
        };
        imports.wbg.__wbg_setentries_0fda6faa888739ea = function(arg0, arg1) {
            arg0.entries = arg1;
        };
        imports.wbg.__wbg_setentries_54d064bfa9bc7b12 = function(arg0, arg1) {
            arg0.entries = arg1;
        };
        imports.wbg.__wbg_setentrypoint_94ded7045723c4c9 = function(arg0, arg1, arg2) {
            arg0.entryPoint = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setformat_abfdc57a4c50f15b = function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        };
        imports.wbg.__wbg_sethasdynamicoffset_f07968ae158be239 = function(arg0, arg1) {
            arg0.hasDynamicOffset = arg1 !== 0;
        };
        imports.wbg.__wbg_setlabel_1c6d2b1c9e9be6cb = function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setlabel_1edb158e2c2e74dc = function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setlabel_2c993f94aad39d77 = function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setlabel_2d06fdef5bb757c8 = function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setlabel_43a6de7484b1227c = function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setlabel_853db14b15f0b9f4 = function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setlabel_9e0830b7fb87d84c = function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setlabel_a55dce2de6e15aae = function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setlabel_deacdb16914ca965 = function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setlabel_fa444683138df2fe = function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        };
        imports.wbg.__wbg_setlayout_06e2e064ceddf18a = function(arg0, arg1) {
            arg0.layout = arg1;
        };
        imports.wbg.__wbg_setlayout_4b7e6ca70a207b81 = function(arg0, arg1) {
            arg0.layout = arg1;
        };
        imports.wbg.__wbg_setmappedatcreation_cac8944b747e87ee = function(arg0, arg1) {
            arg0.mappedAtCreation = arg1 !== 0;
        };
        imports.wbg.__wbg_setminbindingsize_2a736b24cd429dca = function(arg0, arg1) {
            arg0.minBindingSize = arg1;
        };
        imports.wbg.__wbg_setmodule_a48408076f7dc829 = function(arg0, arg1) {
            arg0.module = arg1;
        };
        imports.wbg.__wbg_setmultisampled_89aa3f8ca1864ad3 = function(arg0, arg1) {
            arg0.multisampled = arg1 !== 0;
        };
        imports.wbg.__wbg_setoffset_60f54b835838d86a = function(arg0, arg1) {
            arg0.offset = arg1;
        };
        imports.wbg.__wbg_setpowerpreference_ad71852850bd8848 = function(arg0, arg1) {
            arg0.powerPreference = __wbindgen_enum_GpuPowerPreference[arg1];
        };
        imports.wbg.__wbg_setqueryset_0db5e53e048e07a4 = function(arg0, arg1) {
            arg0.querySet = arg1;
        };
        imports.wbg.__wbg_setrequiredfeatures_360aae2ce3d2381c = function(arg0, arg1) {
            arg0.requiredFeatures = arg1;
        };
        imports.wbg.__wbg_setresource_9ffa3eaa40694cfd = function(arg0, arg1) {
            arg0.resource = arg1;
        };
        imports.wbg.__wbg_setsampler_b4f51284cbe80f7a = function(arg0, arg1) {
            arg0.sampler = arg1;
        };
        imports.wbg.__wbg_setsampletype_6cf538bd15193d22 = function(arg0, arg1) {
            arg0.sampleType = __wbindgen_enum_GpuTextureSampleType[arg1];
        };
        imports.wbg.__wbg_setsize_b2e7d5d7b2596519 = function(arg0, arg1) {
            arg0.size = arg1;
        };
        imports.wbg.__wbg_setsize_bb5ced7d3ef6c87d = function(arg0, arg1) {
            arg0.size = arg1;
        };
        imports.wbg.__wbg_setstoragetexture_a2790d3972c2f24f = function(arg0, arg1) {
            arg0.storageTexture = arg1;
        };
        imports.wbg.__wbg_settexture_f27f10646ce2b382 = function(arg0, arg1) {
            arg0.texture = arg1;
        };
        imports.wbg.__wbg_settimestampwrites_5d02db21881d15a8 = function(arg0, arg1) {
            arg0.timestampWrites = arg1;
        };
        imports.wbg.__wbg_settype_99009480de5e94f7 = function(arg0, arg1) {
            arg0.type = __wbindgen_enum_GpuBufferBindingType[arg1];
        };
        imports.wbg.__wbg_settype_ead65507d10d5a19 = function(arg0, arg1) {
            arg0.type = __wbindgen_enum_GpuSamplerBindingType[arg1];
        };
        imports.wbg.__wbg_setusage_7de66baaeab73b73 = function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        };
        imports.wbg.__wbg_setviewdimension_2d081b42f954e69e = function(arg0, arg1) {
            arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
        };
        imports.wbg.__wbg_setviewdimension_be1a9557869e379a = function(arg0, arg1) {
            arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
        };
        imports.wbg.__wbg_setvisibility_2c1274e59ee7befc = function(arg0, arg1) {
            arg0.visibility = arg1 >>> 0;
        };
        imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        };
        imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
            const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
            return ret;
        };
        imports.wbg.__wbg_submit_19d2c1e85fc7b46d = function(arg0, arg1) {
            arg0.submit(arg1);
        };
        imports.wbg.__wbg_tensor_unwrap = function(arg0) {
            const ret = Tensor.__unwrap(arg0);
            return ret;
        };
        imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        };
        imports.wbg.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
            const ret = arg0.then(arg1, arg2);
            return ret;
        };
        imports.wbg.__wbg_unmap_bea8213fb4e5bbf2 = function(arg0) {
            arg0.unmap();
        };
        imports.wbg.__wbg_versions_c71aa1626a93e0a1 = function(arg0) {
            const ret = arg0.versions;
            return ret;
        };
        imports.wbg.__wbg_writeBuffer_e63bfcf71f66ec6c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.writeBuffer(arg1, arg2, arg3, arg4, arg5);
        }, arguments) };
        imports.wbg.__wbindgen_cb_drop = function(arg0) {
            const obj = arg0.original;
            if (obj.cnt-- == 1) {
                obj.a = 0;
                return true;
            }
            const ret = false;
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper4019 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 1062, __wbg_adapter_34);
            return ret;
        };
        imports.wbg.__wbindgen_closure_wrapper4593 = function(arg0, arg1, arg2) {
            const ret = makeMutClosure(arg0, arg1, 1077, __wbg_adapter_37);
            return ret;
        };
        imports.wbg.__wbindgen_copy_to_typed_array = function(arg0, arg1, arg2) {
            new Uint8Array(arg2.buffer, arg2.byteOffset, arg2.byteLength).set(getArrayU8FromWasm0(arg0, arg1));
        };
        imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        };
        imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0(arg0, arg1));
            return ret;
        };
        imports.wbg.__wbindgen_init_externref_table = function() {
            const table = wasm.__wbindgen_export_2;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
            ;
        };
        imports.wbg.__wbindgen_is_function = function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        };
        imports.wbg.__wbindgen_is_null = function(arg0) {
            const ret = arg0 === null;
            return ret;
        };
        imports.wbg.__wbindgen_is_object = function(arg0) {
            const val = arg0;
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        };
        imports.wbg.__wbindgen_is_string = function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        };
        imports.wbg.__wbindgen_is_undefined = function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        };
        imports.wbg.__wbindgen_memory = function() {
            const ret = wasm.memory;
            return ret;
        };
        imports.wbg.__wbindgen_number_new = function(arg0) {
            const ret = arg0;
            return ret;
        };
        imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };

        return imports;
    }

    function __wbg_init_memory(imports, memory) {

    }

    function __wbg_finalize_init(instance, module) {
        wasm = instance.exports;
        __wbg_init.__wbindgen_wasm_module = module;
        cachedDataViewMemory0 = null;
        cachedFloat32ArrayMemory0 = null;
        cachedUint16ArrayMemory0 = null;
        cachedUint32ArrayMemory0 = null;
        cachedUint8ArrayMemory0 = null;


        wasm.__wbindgen_start();
        return wasm;
    }

    function initSync(module) {
        if (wasm !== undefined) return wasm;


        if (typeof module !== 'undefined') {
            if (Object.getPrototypeOf(module) === Object.prototype) {
                ({module} = module)
            } else {
                console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
            }
        }

        const imports = __wbg_get_imports();

        __wbg_init_memory(imports);

        if (!(module instanceof WebAssembly.Module)) {
            module = new WebAssembly.Module(module);
        }

        const instance = new WebAssembly.Instance(module, imports);

        return __wbg_finalize_init(instance, module);
    }

    async function __wbg_init(module_or_path) {
        if (wasm !== undefined) return wasm;


        if (typeof module_or_path !== 'undefined') {
            if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
                ({module_or_path} = module_or_path)
            } else {
                console.warn('using deprecated parameters for the initialization function; pass a single object instead')
            }
        }

        if (typeof module_or_path === 'undefined' && typeof script_src !== 'undefined') {
            module_or_path = script_src.replace(/\.js$/, '_bg.wasm');
        }
        const imports = __wbg_get_imports();

        if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
            module_or_path = fetch(module_or_path);
        }

        __wbg_init_memory(imports);

        const { instance, module } = await __wbg_load(await module_or_path, imports);

        return __wbg_finalize_init(instance, module);
    }

    wasm_bindgen = Object.assign(__wbg_init, { initSync }, __exports);

})();

local logger = require("logger")
local millennium = require("millennium")

---@ffi
---@param path string
---@return string|nil
function test_assets_read(path)
    return millennium.assets.read(path)
end

---@ffi
---@param path string
---@return integer|nil
function test_assets_size(path)
    return millennium.assets.size(path)
end

---@ffi
---@param path string
---@return string
function test_assets_name(path)
    return millennium.assets.name(path)
end

---@ffi
---@param path string
---@return "file"|"directory"|nil
function test_assets_type(path)
    return millennium.assets.type(path)
end

---@ffi
---@param path string
---@return string[]
function test_assets_list(path)
    return millennium.assets.list(path)
end

local function on_load()
	millennium.ready()
end

local function on_unload()
	logger:info("Plugin unloaded")
end

local function on_frontend_loaded()
	logger:info("Frontend loaded")
end

return {
	on_frontend_loaded = on_frontend_loaded,
	on_load = on_load,
	on_unload = on_unload,
}

local millennium = require("millennium")

---@ffi
---@param lang string
---@return table
function read_locale(lang)
	return millennium.assets.read("locales/" .. lang .. ".json")
end

---@ffi
---@param lang string
---@return string
function read_style(lang)
	return millennium.assets.read("src/styles/" .. lang .. ".css")
end

local function on_load()
	millennium.ready()
end

return {
	on_load = on_load,
}

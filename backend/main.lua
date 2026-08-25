local logger = require("logger")
local millennium = require("millennium")
local utils = require("utils")

local function on_load()
	logger:info("Loaded with Millennium version " .. millennium.version())
	millennium.ready()
end

-- Called when your plugin is unloaded. This happens when the plugin is disabled or Steam is shutting down.
-- NOTE: If Steam crashes or is force closed by task manager, this function may not be called -- so don't rely on it for critical cleanup.
local function on_unload()
	logger:info("Plugin unloaded")
end

-- Called when the Steam UI has fully loaded.
local function on_frontend_loaded()
end

local function get_patches()
	return {
		{
            -- it also has a "tooltip" key in its "option" prop, but idk where
            -- it's used, if at all
			-- TODO actually cuz doesnt work on the "Sort by" dropdown menu
			find = [[className:\(0,\w+\.\w+\)\(\w+\(\)\.DialogDropDownMenu_Item,\w+,\w+\.strOptionClass,\w+&&"ContextMenuAutoFocus"\),]],
			file = [[chunk~[0-9a-f]+\.js]],
			transforms = {
				{
					match = [[(className:\(0,\w+\.\w+\)\(\w+\(\)\.DialogDropDownMenu_Item,\w+,\w+\.strOptionClass,\w+&&"ContextMenuAutoFocus"\)),]],
					replace = [[\1,"aria-label":#{{self}}.FindStringInProps(e),]],
				},
			},
		},
		{
			find = [[unselectable:this\.props\.unselectable,className]],
			file = "library.js",
			transforms = {
				{
                    match = [[(unselectable:this\.props\.unselectable),className]],
					replace = [[\1,"aria-label":#{{self}}.FindStringInProps(this.props),className]],
				},
			},
		},
	}
end

return {
	on_frontend_loaded = on_frontend_loaded,
	on_load = on_load,
	on_unload = on_unload,
	patches = get_patches()
}
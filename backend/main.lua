local logger = require("logger")
local millennium = require("millennium")
local utils = require("utils")

local function on_load()
	millennium.ready()
end

local function on_unload()
	logger:info("Plugin unloaded")
end

local function get_patches()
	return {
		{
			find = [[className:\(0,\w+\.\w+\)\(\w+\(\)\.DialogDropDownMenu_Item,\w+,\w+\.strOptionClass,\w+&&"ContextMenuAutoFocus"\),]],
			file = [[chunk~[0-9a-f]+\.js]],
			transforms = {
				{
					match = [[(className:\(0,\w+\.\w+\)\(\w+\(\)\.DialogDropDownMenu_Item,\w+,\w+\.strOptionClass,\w+&&"ContextMenuAutoFocus"\)),]],
					replace = [[\1,"aria-label":#{{self}}.FindStringInObject(e),]],
				},
			},
		},
		{
			find = [[unselectable:this\.props\.unselectable,className]],
			file = "library.js",
			transforms = {
				{
					match = [[(unselectable:this\.props\.unselectable),(className)]],
					replace = [[\1,"aria-label":#{{self}}.FindStringInObject(this.props),\2]],
				},
			},
		},
	}
end

return {
	on_load = on_load,
	on_unload = on_unload,
	patches = get_patches()
}

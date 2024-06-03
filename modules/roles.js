const {
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} = require("discord.js");

function MapRoleOptionsToSelects(options) {
	return options.map((option) => {
		return new StringSelectMenuOptionBuilder()
			.setLabel(option.role.name)
			.setValue(option.role.id)
			.setEmoji(option.emoji);
	});
}

class RolesSelectComponentBuilder extends StringSelectMenuBuilder {
	addOptions(options) {
		super.addOptions(MapRoleOptionsToSelects(options));

		return this;
	}

	setOptions(options) {
		super.setOptions(MapRoleOptionsToSelects(options));

		return this;
	}

	spliceOptions(index, deleteCount, options) {
		super.spliceOptions(index, deleteCount, MapRoleOptionsToSelects(options));

		return this;
	}
}

module.exports = {
	RolesSelectComponentBuilder: RolesSelectComponentBuilder,
};

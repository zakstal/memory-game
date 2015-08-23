(function (mg) {
	'use strict';

	mg.models.card = Backbone.Model.extend({

		/**
		*
		*/
		initialize: function () {
			console.log('in card model');
			this.changeId();
		},

		/**
		*
		*/
		gifSource: function () {
			return 'https://media.giphy.com/media/' + this.gifId + '/giphy.gif';
		},

		/**
		*
		*/
		changeId: function () {
			this.gifId = this.id;
			this.id = Math.random().toString(36).substring(7);
		}
	});
}(mg));
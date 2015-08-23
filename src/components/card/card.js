(function (mg, wn) {
	'use strict';

	mg.views.card = Backbone.View.extend({

		className: 'card',

		events: {
			'click .cube': 'flipCardShow'
		},

		/**
		*
		*/
		initialize: function (opt) {
			this.$container = opt.container;
			this.template = JST['components/card/card']
			this.isHidden = false;

			this.listenTo(this.model, 'change:hide-cards', this.hideCards);
			this.listenTo(this.model.collection, 'chage:close-cards', this.closeCard);
			this.render();
		},

		/**
		*
		*/
		render: function () {
			console.log('mode', this.model);
			this.$el.html(this.template({
				gifUrl: this.model.gifSource()
			}));
			this.$container.append(this.$el);
			this.$cube = this.$('.cube');
		},

		/**
		*
		*/
		flipCardShow: function (e) {
			if (!this.isHidden) {
				$(e.currentTarget).addClass('rotate');
				this.model.trigger('change:show-card');
			}
		},

		/**
		*
		*/
		closeCard: function () {
			this.$cube.removeClass('rotate');
		},

		/**
		*
		*/
		hideCards: function () {
			this.$el.addClass('hide');
			this.isHidden = true;
		}

	});
}(mg, window));
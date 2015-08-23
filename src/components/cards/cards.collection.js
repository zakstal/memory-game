(function (mg) {
	'use strict';

	mg.collections.cards = Backbone.Collection.extend({

		/**
		* Function: the url can only accept one query at a time and so
		* needs to to mulitple requests if multiple terms are given.
		*
		* For this to work there needs to be a collection in side where models
		* are saved on each request. this collection is the cards collection
		*
		* the giffy url will return by default 25 gifs. the parse functioni attemps
		* to randomize the gifs so on the same term you can have new gifs.
		*
		* For more info on the gif end point: https://github.com/giphy/GiphyAPI
		*/

		/**
		*
		*/
		url: function (searchTerm) {
			return "https://api.giphy.com/v1/gifs/search?&api_key=dc6zaTOxFJmzC";
		},

		/**
		*
		*/
		initialize: function (opt) {
			this.listenTo(this, 'sync', this.success);
			this.cards = new Backbone.Collection();

			this.searchTerms = opt.searchTerms;
			this.numberOfCards = opt.numberOfCards;

			this.searchObject = {};
			this.setSearchLimit();
			this.setSearchTerms();
			this.trimSearchTerms();
		},

		/**
		* Receives an array of search terms
		*/
		fetchGifs: function () {
			_.each(this.searchTerms, this.fetchTerm.bind(this));
		},

		/**
		* Fetches a single search term
		*/
		fetchTerm: function (searchTerm) {
			this.searchObject.q = searchTerm;
			this.fetch({
				data: this.searchObject
			});
		},

		/**
		* Returns the number cards per search term
		* to GET
		*/
		setSearchLimit: function () {
			this.limit = this.numberOfCards / 2;
			if (this.limit > 25) {
				this.searchObject.limit = this.limit
			}
		},

		/**
		* If there are more search terms than cards
		* search terms will be reduced to the limit
		*/
		setSearchTerms: function () {
			if (this.limit < this.searchTerms.length) {
				this.searchTerms = this.searchTerms.slice(0, this.limit);
			}
		},

		/**
		* Only allows even number of search terms other than one
		*/
		trimSearchTerms: function () {
			if (this.searchTerms.length !== 1 && this.searchTerms.length % 2 !== 0) {
				this.searchTerms.pop();
			}
		},

		/*
		* Gets a random object from results to set as 
		* a model
		*/
		getRandRes: function (res) {
			var objIdx = Math.floor(Math.random() * res.data.length);
			var obj = res.data[objIdx];
			delete res.data[objIdx];
			return obj;
		},

		/**
		* Sets models from response to cards collection
		*/
		setModels: function (model) {
			var model = new mg.models.card(model);
			this.cards.add(model);
		},

		/**
		*
		*/
		parse: function (res) {
			var model;
			for (var i = 0; i < this.limit; i++) {
				model = this.getRandRes(res);
				this.setModels(model);
			}
		}
	});
}(mg));
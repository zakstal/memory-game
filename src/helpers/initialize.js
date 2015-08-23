$(function () {
	(function (mg) {
		console.log('body', $('body'));
		new mg.views.cards({
			el: $('body')
		});
	}(mg));
});
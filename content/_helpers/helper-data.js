Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});
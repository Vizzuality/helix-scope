# helix-scope

This project is designed to show some results from Helix project. It is a
React/Redux frontend using CartoDB as a backend (https://helixscope.carto.com).

## Useful resources

* https://github.com/Vizzuality/helix-scope-data (namely backend_examples.ipynb)

## Concepts

A list of concepts and names which will appear throughout the code and site

* `indicator` (also referred to as `variable`) - A numerical indicator about a particular climate-change related aspect, such as the biodiversity of a class, the precipitation or changes to crop yields. These indicators come under several `categories`.

* `scenario` - A future scenario of climate change. Essentially, the change in global temperature in degrees Celsius

* `measure` (sic, also referred to as `value`) - The correct word is measurement. A statistical measure of a particular variable. Particularly, minimum value, maximum value, average value and standard deviation.

## Backend tables description

The following tables hold meta-information that was present in json format
in the examples notebook. The informaton was collected into a single flat file
in `resources/data_management/import_metadata/metadata.js` and posted to cartodb
using the node script in `resources/data_management/import_metadata/import.js`.

* `meta_categories` - Indicator Categories
* `meta_indicators` - Indicators
* `meta_measurements` - Available measurements (min, max, std, mean)
* `meta_scenarios` - Available scenarios (+1.5 ºC, +2ºC, ...)

Additionally, the relationship between categories and indicators is done through
the `meta_categories_indicators` table.

The following tables hold the data used by the application. Their content is not
maintained by this application.

* master_admin0 - Holds information at the Admin-0 (countries) level, used to render charts mostly
* master_5x5 - Holds information at the grid level, used to display the map
* five_grid_shapefiles - The 5x5 grid geometry used to display the map

The files `resources/carto_functions.sql` and `carto_meta_tables.sql` contain the DDL statements
used on cartodb to build the application backend (tables and pgplsql functions)

## Backend functions description

* `get_config` - This function returns a JSON structure with the current
application configuration based on the `meta_` table family. This is used to
initialize the applicaton. The function takes no arguments.

* `get_country` - This function returns a JSON structure with information related to the given country. Its original intent was to return the data used to draw the several charts in the country detail page, but that need was found to be better served by specific SQL queries for each chart.

## Site architecture

The site is divided into three main sections:

* Map page - This page allows the user to see an illustration of multiple climate change related variables (in any combination of indicator, scenario and measurement)

* Country page - This page allows the user to see details of a particular country in the form of multiple charts

* Compare page - This page is essentially a version of the country page that shows country details side by side

## Install

Requirements:

* NodeJs 5.2+ [How to install](https://nodejs.org/download/)
* Heroku toolbet [How to install](https://toolbelt.heroku.com)

To install run this command:

```bash
yarn install
```

## Usage

Run server locally usgin npm:

```bash
NODE_ENV=development yarn start
```

~~Run server locally using Heroku environment:~~

```bash
~~heroku local web~~
```

### Deploy

Configure existing heroku app:

```bash
heroku git:remote -a project
```

Run this command to publish master branch to Heroku:

```bash
git push heroku master
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request :D


## LICENSE

[MIT](LICENSE)

import * as pg from "pg";
import * as config from "config";
import { createFilter, createQuery } from "../lib/index";
import { Edm, odata, ODataController, ODataServer, ODataQuery, ODataErrorHandler, ResourceNotFoundError, createODataServer } from "odata-v4-server";

let db:pg.PoolConfig = config.get<pg.PoolConfig>("sqlConfig");
let pool = new pg.Pool(db);

@Edm.OpenType
class Country{
    @Edm.Key
    @Edm.String
    code:string
}

@Edm.OpenType
class City{
    @Edm.Key
    @Edm.Int32
    id:number
}

class CountryLanguage{
    @Edm.String
    countrycode:string

    @Edm.String
    language:string

    @Edm.String
    isofficial:string

    @Edm.Double
    percentage:number
}

@odata.type(Country)
class CountriesController extends ODataController{
    @odata.GET
    async getCountries(@odata.query query){
        let sqlQuery = createQuery(query);
        return (await pool.connect()).query(sqlQuery.from("country"), sqlQuery.parameters).then(result => result.rows);
    }

    @odata.GET
    async getCountry(@odata.key code:string, @odata.query query){
        let sqlQuery = createQuery(query);
        return (await pool.connect()).query(`SELECT ${sqlQuery.select} FROM country WHERE code = $${sqlQuery.parameters.length + 1} AND (${sqlQuery.where})`, sqlQuery.parameters.concat([code])).then(result => result.rows[0]);
    }
}

@odata.type(City)
class CitiesController extends ODataController{
    @odata.GET
    async getCities(@odata.stream stream, @odata.query query){
        let sqlQuery = createQuery(query);
        return (await pool.connect()).query(sqlQuery.from("country"), sqlQuery.parameters).then(result => result.rows);
    }

    @odata.GET
    async getCity(@odata.key id:number, @odata.query query){
        let sqlQuery = createQuery(query);
        return (await pool.connect()).query(`SELECT ${sqlQuery.select} FROM country WHERE id = $${sqlQuery.parameters.length + 1} AND (${sqlQuery.where})`, sqlQuery.parameters.concat([id])).then(result => result.rows[0]);
    }
}

@odata.type(CountryLanguage)
class CountryLanguagesController extends ODataController{
    @odata.GET
    async getLanguages(@odata.stream stream, @odata.query query){
        let sqlQuery = createQuery(query);
        return (await pool.connect()).query(sqlQuery.from("countrylanguage"), sqlQuery.parameters).then(result => result.rows);
    }
}

@odata.cors
@odata.controller(CountriesController, true)
@odata.controller(CitiesController, true)
@odata.controller(CountryLanguagesController, true)
class SqlServer extends ODataServer{}

SqlServer.create("/odata", 3004);
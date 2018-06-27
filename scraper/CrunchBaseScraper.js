
const cheerio = require("cheerio");
const request = require('async-request');


class CrunchBaseScraper {

    async requestPage(url) {
        return await request(url);
    }

    loadPage(page) {
        return cheerio.load(page.body);
    }

    scrapeClassHrefs($, classString) {
        // want all hrefs for elements with given class string (cb-link ng-star-inserted)
        return $(classString).map((index, value) => $(value).attr('href'));
    }

    findCategoryHrefs($) {
        return $("a[href*='/search/organizations/field/organizations/categories/']").map((index, value) => $(value).attr('title'));
    }

    filterHRefs(hrefArray, regex) {
        // probs gonna filter where href starts with '/search/organizations/field/organizations/categories/'
        return hrefArray.filter((href) => regex.test(href))
    }

    trimHrefs(hrefArray, regex) {
        return hrefArray.map((href) => href.replace(regex, ''));
    }

    findCategories($) {
        let hrefs = this.scrapeClassHrefs($, '.cb-link.ng-star-inserted');

        let hrefRegex = new RegExp("^/search/organizations/field/organizations/categories/")
        let categoryHrefs = this.filterHRefs(hrefs.toArray(), hrefRegex);
        let categories = this.trimHrefs(categoryHrefs, hrefRegex);

        return categories;
    }

    async scrapePage(url) {
        let page = await this.requestPage(url);

        let $ = await this.loadPage(page);

        let categories = this.findCategoryHrefs($);

        return categories.toArray();
    }
}



module.exports = CrunchBaseScraper
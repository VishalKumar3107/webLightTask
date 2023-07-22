const BASE_URL = 'https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc';

export const Githubapi = async (page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}&page=${page}`);
        const data = await response.json();

        const nextPageResponse = await fetch(`${BASE_URL}&page=${page + 1}`);
        const nextPageData = await nextPageResponse.json();

        const combinedData = {
            total_count: data.total_count,
            incomplete_results: data.incomplete_results,
            items: [...data.items, ...nextPageData.items]
        };

        console.log(combinedData);
        return combinedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
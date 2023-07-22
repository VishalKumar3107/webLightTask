

// const BASE_URL = 'https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc';

// export const GithubApi = async (page = 1) => {
//     try {
//         const response = await fetch(`${BASE_URL}&page=${page}`);
//         const data = await response.json();

//         const nextPageResponse = await fetch(`${BASE_URL}&page=${page + 1}`);
//         const nextPageData = await nextPageResponse.json();

//         // Combine the current page data with the next page data
//         const combinedData = {
//             total_count: data.total_count,
//             incomplete_results: data.incomplete_results,
//             items: [...data.items, ...nextPageData.items]
//         };

//         console.log(combinedData);
//         return combinedData;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return [];
//     }
// }



const BASE_URL =
  "https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc";

export const GithubApi = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}&page=${page}`);
    const data = await response.json();

    if (page === 1) {
      const pageCount = Math.ceil(data.total_count / 100); // GitHub API returns up to 100 items per page
      const remainingPages = Array.from({ length: pageCount - 1 }, (_, index) => index + 2);

      const nextPageData = await Promise.all(
        remainingPages.map(async (nextPage) => {
          const nextPageResponse = await fetch(`${BASE_URL}&page=${nextPage}`);
          return nextPageResponse.json();
        })
      );

      const combinedData = {
        total_count: data.total_count,
        incomplete_results: data.incomplete_results,
        items: data.items.concat(...nextPageData.map((pageData) => pageData.items)),
      };

      console.log(combinedData);
      return combinedData;
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

import superagentClient, { GET, POST, DELETE, PUT, PATCH } from './util/superagent';

const clientVal = superagentClient();
let dedupe = null;
const client = (...args) =>
  clientVal.apply(null, args).then((data) => {
    if (args[3]) return data;
    if (data.status !== 200) {
      if (dedupe !== data.body.data && data.status !== 400) {
        if (data.status === 404) {
          alert('검색결과가 없습니다.');
        } else {
          alert(data.body.data);
        }
        if (data.body.name === 'LoginRequired') location.reload();
      }
      dedupe = data.body.data;
    }
    return data;
  });

export const getCurrentUser = () => client(GET, '/user', {}, true);
export const login = (email, password) =>
  client(POST, '/session/', {
    body: { email, password, type: "local" },
    //query: { session: 1 },
  });
export const logout = () => client(DELETE, '/session');

export const getCommodity = (id) =>
  client(GET, `/commodity/getCommodity/${id}`);

export const deleteCommodity = (id) =>
  client(DELETE, `/commodity/${id}`);

export const deleteEquipment = (id) =>
  client(DELETE, `/equipment/${id}`);


export const getCompanies = (query) =>
  client(GET, '/company/list', {
    query: Object.assign({ filterType: 'Title', search:'' }, query),
  });

export const getCompany = (id,query) =>
  client(GET, `/company/getCompany/${id}`, {
    query,
  });

export const deleteCompany = (id) =>
  client(DELETE, `/company/${id}`);

export const postCompany = (data) =>
  client(POST, '/company/register', { body: data })

export const putCompany = (data) =>
  client(PUT, '/company/save', { body: data })
export const patchUsers = (id, data) =>
  client(PATCH, `/users/${id}`, {
    body: data,
  });

export const patchPassword = ( data) =>
  client(PATCH, `/session/password`, {
    body: data,
  });
export const postAccounts = (data, files) =>
  client(POST, `/session/register`, {
    body: data,
  });
export const deleteUsers = (id) => client(DELETE, `/users/${id}`);


export const getInquiries = (query) =>
  client(GET, '/inquiry/list', {
    query,
  });

export const getOrders = (query) =>
  client(GET, '/payment/list', {
    query,
  });
export const getEquipment = (csn, query) => 
  client(GET, `/equipment/getEquipmentByCsn/${csn}`, {
    query,
  });

export const postCommodity = (csn,data) => client(POST, `/commodity/save/${csn}`, { body: Object.assign(data,{csn}) });

export const getConfig = (csn, query) => 
  client(GET, `/config`, {
    query,
  });

export const postConfig = (data) => client(POST, `/config`, {body:data});

export const deleteUser = (id) => client(DELETE, `/users/${id}`);

export const deleteInquiry = (id) => client(DELETE, `/inquiry/${id}`);

export const getNotices = (query) =>
  client(GET, '/notices', {
    query: Object.assign({ count: 1 }, query),
  });
export const getNotice = (id) => client(GET, `/notices/${id}`);
export const patchNotice = (id, data) =>
  client(PATCH, `/notices/${id}`, {
    body: data,
  });
export const postNotice = (data, files) =>
  client(POST, `/notices`, {
    body: data,
  });

export const getAdminComments = (query) =>
  client(GET, '/comments', {
    query: Object.assign({ count: 1 }, query),
  });

export const getAdminMatchings = (query) =>
  client(GET, '/matchings', {
    query: Object.assign({ count: 1 }, query),
  });

export const getPlaces = (query) =>
client(GET, '/places', {
  query: Object.assign({ count: 1 }, query),
});
export const getPlace = (id) => client(GET, `/places/${id}`);
export const patchPlace = (id, data) =>
client(PATCH, `/places/${id}`, {
  body: data,
});
export const postPlace = (data, files) =>
client(POST, `/places`, {
  body: data,
});

export const getEmployeeTables = (query) =>
client(GET, '/employeeTables', {
  query: Object.assign({ count: 1 }, query),
});
export const getEmployeeTable = (id) => client(GET, `/employeeTables/${id}`);
export const patchEmployeeTable = (id, data) =>
client(PATCH, `/employeeTables/${id}`, {
  body: data,
});
export const postEmployeeTables = (data, files) =>
client(POST, `/employeeTables`, {
  body: data,
});

export const getWeddingLogs = (query) =>
client(GET, '/weddingLogs', {
  query: Object.assign({ count: 1 }, query),
});
export const getWeddingLog = (id) => client(GET, `/weddingLogs/${id}`);
export const patchWeddingLog = (id, data) =>
client(PATCH, `/weddingLogs/${id}`, {
  body: data,
});
export const postWeddingLogs = (data, files) =>
client(POST, `/weddingLogs`, {
  body: data,
});

  export const getGroups = (query) =>
  client(GET, '/groups', {
    query: Object.assign({ count: 1 }, query),
  });
export const getGroup = (id) => client(GET, `/groups/${id}`);
export const deleteGroup = (id) => client(DELETE, `/groups/${id}`);
export const patchGroup = (id, data) =>
  client(PATCH, `/groups/${id}`, {
    body: data,
  });
export const postGroup = (data, files) =>
  client(POST, `/groups`, {
    body: data,
  });

export const deleteNotice = (id) => client(DELETE, `/notices/${id}`);
export const deletePlace = (id) => client(DELETE, `/places/${id}`);
export const deleteEmployeeTable = (id) => client(DELETE, `/employeeLogs/${id}`);
export const deleteWeddingLog = (id) => client(DELETE, `/weddingLogs/${id}`);
export const deleteMatching = (id) => client(DELETE, `/matchings/${id}`);
export const deleteNoticePhoto = (id, photoId) => client(DELETE, `/notices/${id}/photos/${photoId}`);
export const postNoticePhotos = (id, file) => client(POST, `/notices/${id}/photos`, { body: file });

export const deleteUserPhoto = (id, photoId) => client(DELETE, `/users/${id}/photos/${photoId}`);
export const postUserPhotos = (id, file) => client(POST, `/users/${id}/photos`, {body: file });


export const getBusinesses = (query) =>
  client(GET, '/pendingBusinesses', {
    query: Object.assign({ count: 1 }, query),
  });
export const getBusiness = (id) => client(GET, `/pendingBusinesses/${id}`);
export const patchBusiness = (id, data) =>
  client(PATCH, `/pendingBusinesses/${id}`, {
    body: data,
  });
  export const postBusinesses = (data, files) =>
  client(POST, `/pendingBusinesses`, {
    body: data,
    files: { photos: files },
  });

  export const uploadPdf = (data, files) =>
  client(POST, `/uppdf`, {
    body: data,
    files: { pdf: files },
  });

export const deleteBusiness = (id) => client(DELETE, `/pendingBusinesses/${id}`);
export const deleteBusinessPhoto = (id, photoId) => client(DELETE, `/pendingBusinesses/${id}/photos/${photoId}`);
export const postBusinessPhotos = (id, file) => client(POST, `/pendingBusinesses/${id}/photos`, {body: file });

export const getUsers = (query) =>
  client(GET, '/users', {
    query: Object.assign({ count: 1 }, query),
  });
export const getUser = (id) => client(GET, `/users/${id}`);
export const patchUser = (id, data) =>
  client(PATCH, `/users/${id}`, {
    body: data,
  });
export const patchMatching = (userId, id, data) =>
  client(PATCH, `/matchings/${id}`, {
    body: Object.assign({userId}, data),
  });
export const postUser = (data, files) =>
  client(POST, `/users`, {
    body: data,
    files: { photos: files },
  });

export const postAccount = (data, files) =>
  client(POST, `/session/register`, {
    body: data,
    files: { photos: files },
  });

export const postManager = (data, files) =>
  client(POST, `/users`, {
    body: data,
    files: { photos: files },
  });

export const getFilters = (query) =>
  client(GET, '/filters', {
    query: Object.assign({ count: 1 }, query),
  });
export const getFilter = (id) => client(GET, `/filters/${id}`);
export const patchFilter = (id, data) =>
  client(PATCH, `/filters/${id}`, {
    body: data,
  });
export const postFilter = (data, files) =>
  client(POST, `/filters`, {
    body: data,
    files: { photos: files },
  });

export const deleteFilter = (id) => client(DELETE, `/filters/${id}`);

export const getQuizs = (query) =>
  client(GET, '/quizs', {
    query: Object.assign({ count: 1 }, query),
  });
export const getQuiz = (id) => client(GET, `/quizs/${id}`);
export const patchQuiz = (id, data) =>
  client(PATCH, `/quizs/${id}`, {
    body: data,
  });
export const postQuiz = (data, files) =>
  client(POST, `/quizs`, {
    body: data,
    files: { photos: files },
  });

export const deleteQuiz = (id) => client(DELETE, `/quizs/${id}`);

export const patchInputDataBulk = (data, files) =>
client(PATCH, `/inputDatas`, {
  body: data,
  files: { xlsx: files },
});

export const putPDFFile = (data, files) =>
client(POST, `/uppdf`, {
  body: data,
  files: { pdf: files },
});

export const putInputDataBulk = (data, files) =>
client(PUT, `/inputDatas`, {
  body: data,
  files: { xlsx: files },
});

export const getComments = (id, query) =>
  client(GET, `/users/${id}/comments`, {
    query: Object.assign({ count: 1 }, query),
  });
export const postComment = (id, data) =>
  client(POST, `/users/${id}/comments`, {
    body: data,
  });


export const getMatching = (id, query) =>
  client(GET, `/users/${id}/matchings`, {
    query: Object.assign({ count: 1 }, query),
  });
export const postMatching = (id, data) =>
  client(POST, `/users/${id}/matching`, {
    body: data,
  });


export const getCenters = (query) =>
  client(GET, '/centers', {
    query: Object.assign({ count: 1 }, query),
  });

export const getSystemLogs = (query) =>
  client(GET, '/systemLogs', {
    query: Object.assign({ count: 1 }, query),
  });

export const getCenter = (id) => client(GET, `/centers/${id}`);
export const patchCenter = (id, data) =>
  client(PATCH, `/centers/${id}`, {
    body: data,
  });
export const postCenter = (data, files) =>
  client(POST, `/centers`, {
    body: data,
    files: { photos: files },
  });
export const deleteCenter = (id) => client(DELETE, `/centers/${id}`);

export const getQuestions = (query) =>
  client(GET, '/questions', {
    query: Object.assign({ count: 1 }, query),
  });
export const getQuestion = (id) => client(GET, `/questions/${id}`);
export const patchQuestion = (id, data) =>
  client(PATCH, `/questions/${id}`, {
    body: data,
  });
export const postQuestion = (data, files) =>
  client(POST, `/questions`, {
    body: data,
    files: { photos: files },
  });
export const deleteQuestion = (id) => client(DELETE, `/questions/${id}`);
export const deleteFilterPhoto = (id, photoId) => client(DELETE, `/filters/${id}/photos/${photoId}`);
export const postFilterPhotos = (id, file) => client(POST, `/filters/${id}/photos`, {body: file });


export const getInputDatas = (query) =>
  client(GET, '/inputDatas', {
    query: Object.assign({ count: 1 }, query),
  });
export const getInputData = (id) => client(GET, `/inputDatas/${id}`);
export const patchInputData = (id, data) =>
  client(PATCH, `/inputDatas/${id}`, {
    body: data,
  });
export const postInputData = (data, files) =>
  client(POST, `/inputDatas`, {
    body: data,
  });
export const deleteInputData = (id) => client(DELETE, `/inputDatas/${id}`);

export const patchQuizBulk = (data, files) =>
client(PATCH, `/quizs`, {
  body: data,
  files: { xlsx: files },
});

export const putQuizBulk = (data, files) =>
client(PUT, `/quizs`, {
  body: data,
  files: { xlsx: files },
});

export const getItems = (query) =>
  client(GET, '/items', {
    query: Object.assign({ count: 1 }, query),
  });
export const getItem = (id) => client(GET, `/items/${id}`);
export const patchItem = (id, data) =>
  client(PATCH, `/items/${id}`, {
    body: data,
  });
export const postItem = (data, files) =>
  client(POST, `/items`, {
    body: data,
  });
export const deleteItem = (id) => client(DELETE, `/items/${id}`);
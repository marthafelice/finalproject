import {computed, reactive, ref} from 'vue';
import {useFind, usePagination} from 'feathers-pinia';


export default function useFindPaginate(
  {
    limit = ref(10),
    skip = ref(0),
    model,
    query = computed(() => null),
    params = computed(() => null),
    qid = ref('default'),
    infinite = ref(false),
    useFindOptions = {},
  } = {}) {

  const store = model.store;
  const pagination = reactive({$limit: limit.value, $skip: skip.value});

  const newParams = computed(() => {
    return {
      paginate: true,
      ...params.value,
      qid: qid.value,
      query: {
        ...query.value,
        ...pagination,
      },
    };
  });

  let options = computed(() => {
    return {
      model,
      params: newParams,
      ...useFindOptions,
    };
  });

  let findMeta = useFind(options.value);
  const {items, latestQuery, paginationData} = findMeta;

  let newItems = computed(() => {
    if (infinite.value) {
      let mostRecentQueries = paginationData.value?.[qid.value]?.[latestQuery.value?.queryId] || {};
      let ids = Object.keys(mostRecentQueries).filter(key => !['total', 'queryParams'].includes(key)).reduce((acc, qkey) => {
        acc = acc.concat(mostRecentQueries?.[qkey]?.ids || []);
        return acc;
      }, []);
      return ids.map(id => store.itemsById[id]);
    }
    return items.value;
  });

  const paginationMeta = usePagination(pagination, latestQuery);

  return {
    ...findMeta,
    ...paginationMeta,
    items: newItems,
    pagination,
  };
}

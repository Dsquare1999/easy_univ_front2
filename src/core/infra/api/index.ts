import { authApi } from "./auth.api";
import { filiereApi } from "./filiere.api";
import { uniteApi } from "./unite.api";
import { cycleApi } from "./cycle.api";
import { classeApi } from "./classe.api";
import { matiereApi } from "./matiere.api";
import { tagApi } from "./tag.api";

export { default as api } from "./base.api";

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useAddDetailsMutation,
  useUpdateCoverMutation,
  endpoints: {
    register,
    logout,
    addDetails,
    updateCover,
    userList,
    turnProfessor,
    turnStudent,
    deleteUser,
  },
} = authApi;

export const {
  useFiliereListQuery,
  useFiliereCreateMutation,
  endpoints: { filiereList, filiereCreate },
} = filiereApi;

export const {
  useUniteListQuery,
  useUniteCreateMutation,
  endpoints: { uniteList, uniteCreate },
} = uniteApi;

export const {
  useCycleListQuery,
  useCycleCreateMutation,
  endpoints: { cycleList, cycleCreate },
} = cycleApi;

export const {
  useTagListQuery,
  useTagCreateMutation,
  endpoints: { tagList, tagCreate },
} = tagApi;

export const {
  useClasseListQuery,
  useClasseCreateMutation,
  endpoints: {
    classeList,
    classeCreate,
    classeRetrieve,
    studentList,
    studentCreate,
    studentLeave,
    studentValidate,
    studentRefuse
  },
} = classeApi;

export const {
  endpoints: {
    matiereCreate,
    matiereList,
    matiereUpdate,
    matiereDelete,
    programCreate,
    programUpdate,
    programDelete,
    programReport,
    releveCreate,
    releveGenerate,
  },
} = matiereApi;

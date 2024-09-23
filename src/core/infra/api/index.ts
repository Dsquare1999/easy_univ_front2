import { authApi } from './auth.api';
import { filiereApi } from './filiere.api';
import { cycleApi } from './cycle.api';
import { classeApi } from './classe.api';
import { tagApi } from './tag.api';

export { default as api } from './base.api';

export const { 
    useLoginMutation, 
    useRegisterMutation,
    useLogoutMutation, 
    useRefreshTokenMutation,
    useAddDetailsMutation,
    useUpdateCoverMutation,
    endpoints: {register, logout, addDetails, updateCover}
} = authApi;

export const {
    useFiliereListQuery,
    useFiliereCreateMutation,
    endpoints: { filiereList, filiereCreate },
} = filiereApi;

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
    endpoints: { classeList, classeCreate, studentList, studentCreate, studentLeave, studentValidate, studentRefuse },
} = classeApi;

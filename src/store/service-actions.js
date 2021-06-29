import { serviceActions } from "./serviceSlice";
import UserService from "../services/user.service";

export const fetchServices = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await UserService.getServices();

      return response;
    };

    try {
      const res = await fetchData();
      dispatch(serviceActions.setServices({ serviceData: res.data.services }));
    } catch (error) {
      console.log(error);
    }
  };
};

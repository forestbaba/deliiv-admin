import { orderActions } from "./order-slice";
import UserService from "../services/user.service";

export const fetchOrders = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await UserService.getOrders();
      return response;
    };

    try {
      const res = await fetchData();
      dispatch(orderActions.setOrders({ ordersData: res.data.order }));
   //   dispatch(orderActions.setNewOrders({ ordersData: res.data }));
    } catch (error) {
      console.log(error);
    }
  };
};

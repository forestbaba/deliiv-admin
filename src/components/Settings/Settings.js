import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import WidgetsDropdown from "src/views/widgets/WidgetsDropdown";
import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CModal,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CForm,
  CSpinner,
  CFormGroup,
  CInputCheckbox,
  CLabel,
  CSelect,
  CBadge
} from "@coreui/react";

import userService from "src/services/user.service";
import { toast } from 'react-toastify';
import LocalStorage from "../../utils/localstorage";

const userData = LocalStorage.get("user_data");

const Settings = (props) => {
  const [formIsValid, setFormIsValid] = React.useState(true);
  const [admin, setAdmin] = React.useState([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [fullName, setFullName] = React.useState('');
  const [activeAdmin, setActiveAdmin] = React.useState([]);
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [accountVerification, setAccountVerification] = React.useState(false);
  const [accountSettings, setAccountSettings] = React.useState(false);
  const [paymentApproval, setPaymentApproval] = React.useState(false);
  const [notificationAccess, setNotificationAccess] = React.useState(false);
  // const [priceChange, setPrice_change] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [price, setPrice] = React.useState('');
  const [charge, setCharge] = React.useState('');
  const [update, setUpdate] = React.useState(false);
  const [config, setConfig] = React.useState(null);

  const [newUserBonus, setNewUserBonus] = React.useState(false);
  const [newUserBonusValue, setNewUserBonusValue] = React.useState(0);

  const [refferalBonus, setRefferalBonus] = React.useState(false);
  const [refferalBonusValue, setRefferalBonusValue] = React.useState(0);

  const [freeDelivery, setFreeDelivery] = React.useState(false);
  const [freeDeliveryValue, setFreeDeliveryValue] = React.useState(0);

  const [discountStatus, setDiscountStatus] = React.useState(false);
  const [discount, setDiscount] = React.useState(0);



  useEffect(() => {
    userService.allAdmin().then(data => {
      setAdmin(data.data.admin)
      setConfig(data.data.system_config)

      setPrice(data.data.system_config[0].price_per_km)
      setCharge(data.data.system_config[0].service_charge)

      setAllVariable(data.data.system_config[0].ft_bonus_active_status,
        data.data.system_config[0].ft_bonus_price_tag,
        data.data.system_config[0].ref_bonus_active_status,
        data.data.system_config[0].ref_bonus_price_tag,
        data.data.system_config[0].free_delivery_bonus_active,
        data.data.system_config[0].free_delivery_bonus_trigger,
        data.data.system_config[0].dicount_active_status,
        data.data.system_config[0].discount_rate)

    }).catch((error) => {
      toast.error(error.response.data.message);
    });


  }, [])

  const setAllVariable = (newUserBonus, newUserBonusValue,
    refferalBonus, refferalBonusValue,
    freeDelivery, freeDeliveryValue,
    discountStatus, discount) => {
    setNewUserBonus(newUserBonus)
    setNewUserBonusValue(newUserBonusValue)
    setRefferalBonus(refferalBonus)
    setRefferalBonusValue(refferalBonusValue)
    setFreeDelivery(freeDelivery)
    setFreeDeliveryValue(freeDeliveryValue)
    setDiscountStatus(discountStatus)
    setDiscount(discount)
  }

  useEffect(() => {

    setFullName(activeAdmin.full_name)
    setEmail(activeAdmin.email)
    setAccountVerification(activeAdmin.account_verification)
    setAccountSettings(activeAdmin.setting_access)
    setNotificationAccess(activeAdmin.notification_access)
    setPaymentApproval(activeAdmin.payment_approval)
    // setPrice_change(activeAdmin.price_change)
    setActive(activeAdmin.active)
  }, [activeAdmin])

  const fields = [
    { key: 'full_name', _style: { width: '20%' } },
    { key: 'email', _style: { width: '20%' } },
    { key: 'account_verification', _style: { width: '20%' } },
    { key: 'notification_access', _style: { width: '20%' } },
    { key: 'payment_approval', _style: { width: '20%' } },
    { key: 'active', _style: { width: '20%' } },
    {
      key: "view",
      _style: { minWidth: "1%" },
      label: "Action",

    },

  ]

  const handleSubmit = () => {

    let data = {
      email: email,
      full_name: fullName,
      password: password,
      account_verification: accountVerification,
      setting_access: accountSettings,
      // price_change: priceChange,
      notification_access: notificationAccess,
      payment_approval: paymentApproval,
      active: active,
    }
    if (!email || !fullName || !password) {
      toast.error('All fields are required')
    }

    userService
      .createAdmin(data)
      .then(() => {

        toast.success('Admin Added');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        toast.error('Error adding admin')
        toast.error(error.response.data.message);
      });
  }
  const handleSubmitUpdate = () => {
    let data = {
      email: email,
      full_name: fullName,
      password: password,
      account_verification: accountVerification,
      setting_access: accountSettings,
      notification_access: notificationAccess,
      payment_approval: paymentApproval,
      active: active,
    }
    userService
      .updateAdmin(data)
      .then(() => {

        toast.success('Admin updated');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  const updateSystemBonus = () => {

    let data = {
      free_delivery_status: freeDelivery,
      free_delivery_trigger: freeDeliveryValue,
      discount_rate: discount,
      discount_status: discountStatus,
      first_time_price: newUserBonusValue,
      first_time_bonus: newUserBonus,
      referral_price: refferalBonusValue,
      referral_bonus: refferalBonus
    }

    userService
      .updateSystemBonus(data)
      .then(() => {

        toast.success('Bonus updated');

        setAllVariable(data.first_time_bonus,
          data.first_time_price,
          data.referral_bonus,
          data.referral_price,
          data.free_delivery_status,
          data.free_delivery_trigger,
          data.discount_status,
          data.discount_rate)
      })
      .catch((error) => {
        toast.error("Error updating bonus")
        toast.error(error.response.data.message);
      });
  }

  const handlePriceUpdate = () => {
    userService
      .updateSystemConfig({ price: price, charge: charge })
      .then(() => {

        toast.success('Price and charge Updated');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        toast.error('Error updating price and charge')
        console.log(error);
        toast.error(error.response.data.message);
      });
  }

  return (
    <>
      <CCard>

        <CCardBody>
          <h3>
            <strong>Existing Admin</strong>
          </h3>
          <br />
          <CRow>
            <CDataTable
              items={admin}
              fields={fields}
              // columnFilter
              // tableFilter
              // cleaner
              // itemsPerPageSelect
              itemsPerPage={50}
              hover
              pagination
              // loading
              // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
              // onPageChange={(val) => console.log('new page:', val)}
              // onPagesChange={(val) => console.log('new pages:', val)}
              // onPaginationChange={(val) => console.log('new pagination:', val)}
              // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
              // onSorterValueChange={(val) => console.log('new sorter value:', val)}
              // onTableFilterChange={(val) => console.log('new table filter:', val)}
              // onColumnFilterChange={(val) => console.log('new column filter:', val)}
              scopedSlots={{

                view: (data) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="info"
                        variant="outline"
                        // shape="square"
                        size="sm"
                        onClick={() => setActiveAdmin(data)}>
                        Edit
                      </CButton>
                    </td>
                  );
                },
              }}
            />

            <CCol xs="12" md="8">

              <CCard>
                <br />
                <br />
                <br />
                <CCardBody>
                  <CForm onSubmit={null}>
                    <h3>
                      <strong> Admin new admin</strong>
                    </h3>
                    <CInputGroup className="mb-3">
                      <CInput
                        type="text"
                        placeholder="Full name"
                        name="full_name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                      />

                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInput
                        type="text"
                        placeholder="Email"
                        autoComplete="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">

                      <CInput
                        type="password"
                        placeholder="Password"
                        name="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow className="p-0 m-0">
                      <CCol xs="6" className="p-0 m-0">
                        {error && <p style={{ color: "tomato" }}>{error}</p>}
                      </CCol>
                    </CRow>
                    <h4><strong>Admin Permission</strong></h4>
                    <CFormGroup variant="custom-checkbox" className="my-2 mt-4">
                      <div style={{ display: "flex", flexDirection: "row", margin: 20 }}>
                        <input type="checkbox"
                          value={accountSettings}
                          checked={accountSettings}

                          style={{ width: '40px', height: "40px" }}
                          onChange={e => setAccountSettings(!accountSettings)} />
                        <label for="" style={{ textAlign: "center", padding: "10px" }}> Settings Access</label>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row", margin: 20 }}>
                        <input type="checkbox"
                          value={accountVerification}
                          checked={accountVerification}

                          style={{ width: '40px', height: "40px" }}
                          onChange={e => setAccountVerification(!accountVerification)} />
                        <label for="" style={{ textAlign: "center", padding: "10px" }}> Account Verification</label>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row", margin: 20 }}>
                        <input type="checkbox"
                          checked={paymentApproval}
                          value={paymentApproval}
                          style={{ width: '40px', height: "40px" }}
                          onChange={e => setPaymentApproval(!paymentApproval)} />
                        <label for="" style={{ textAlign: "center", padding: "10px" }}> Payment Approval</label>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row", margin: 20 }}>
                        <input type="checkbox"
                          value={notificationAccess}
                          checked={notificationAccess}

                          style={{ width: '40px', height: "40px" }}
                          onChange={e => setNotificationAccess(!notificationAccess)} />
                        <label for="" style={{ textAlign: "center", padding: "10px" }}> Notification Access</label>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row", margin: 20 }}>
                        <input type="checkbox"
                          value={active}
                          checked={active}

                          style={{ width: '40px', height: "40px" }}
                          onChange={e => setActive(!active)} />
                        <label for="" style={{ textAlign: "center", padding: "10px" }}> Active</label>
                      </div>
                      {/* <div style={{ display: "flex", flexDirection: "row", margin: 20 }}>
                        <input type="checkbox"
                          value={priceChange}
                          checked={priceChange}

                          style={{ width: '40px', height: "40px" }}
                          onChange={e => setPrice_change(!priceChange)} />
                        <label for="" style={{ textAlign: "center", padding: "10px" }}> Update price</label>
                      </div> */}
                      {/* <div style={{ display: "flex", flexDirection: "row", margin: 20 }}>
                    <input type="checkbox" name="love" value="love" id="love"
                      style={{ width: '40px', height: "40px" }} />
                    <label for="" style={{ textAlign: "center", padding: "10px" }}> Other Permission</label>
                  </div> */}
                    </CFormGroup>
                    {activeAdmin && Object.keys(activeAdmin).length > 0 ? (
                      <CRow>
                        <CCol xs="6">
                          <CButton color="primary"
                            disabled={!email}
                            onClick={handleSubmitUpdate}>
                            {loading && <CSpinner size="sm" />}
                            <span className="ml-2">Update Admin</span>
                          </CButton>
                        </CCol>
                      </CRow>
                    ) : (
                      <CRow>
                        <CCol xs="6">
                          <CButton color="primary"
                            disabled={!email || !password || !fullName}
                            onClick={handleSubmit}>
                            {loading && <CSpinner size="sm" />}
                            <span className="ml-2">Add Admin</span>
                          </CButton>
                        </CCol>
                      </CRow>
                    )}
                    <br />
                    <h4>Pricing</h4>
                    <br />

                    <CRow>

                      <CCol xs="12" md="4">
                        {!update &&

                          <CCard style={{ padding: 10 }}>
                            Price per kilometer
                            <CCardBody>
                              <h3>
                                <strong>
                                  {price}
                                </strong>
                              </h3>
                            </CCardBody>

                            Service charge (%)
                            <CCardBody>
                              <h3>
                                <strong>
                                  {charge}
                                </strong>
                              </h3>
                            </CCardBody>
                            <CButton
                              color="info"
                              variant="outline"
                              size="sm"
                              onClick={() => setUpdate(true)}
                            >
                              update
                            </CButton>

                          </CCard>
                        }
                        {
                          update &&
                          <>
                            <p>Price per km</p>
                            <CInputGroup className="mb-3">
                              <CInput
                                type="number"
                                placeholder="Price"
                                autoComplete="price"
                                name="price"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                              />
                            </CInputGroup>
                            <>
                              <p>Service charge (%)</p>
                              <CInputGroup className="mb-3">
                                <CInput
                                  type="number"
                                  placeholder="Charge"
                                  autoComplete="charge"
                                  name="charge"
                                  value={charge}
                                  onChange={e => setCharge(e.target.value)}
                                />
                              </CInputGroup>
                              <CCol xs="6" md="6">
                                <CButton color="primary"
                                  // disabled={!charge}
                                  onClick={handlePriceUpdate}
                                >
                                  {loading && <CSpinner size="sm" />}
                                  <span className="ml-2">Update</span>
                                </CButton>
                              </CCol>
                            </>
                          </>
                        }
                      </CCol>
                    </CRow>
                  </CForm>
                  <br />
                  <br />
                  <br />
                  <h4><strong>Bonus</strong></h4>
                  <CFormGroup variant="custom-checkbox" className="my-2 mt-4">
                    <div style={{ flexDirection: "column" }}>

                      <div style={{ display: "flex", flexDirection: "row", margin: 20 }}>
                        <input type="checkbox"
                          value={newUserBonus}
                          checked={newUserBonus}
                          style={{ width: '40px', height: "40px" }}
                          onChange={e => setNewUserBonus(!newUserBonus)} />
                        <label for="" style={{ textAlign: "center", padding: "10px" }}>New User</label>

                      </div>
                      {
                        newUserBonus && <div style={{ paddingLeft: '50px' }}>
                          <p><i>This is the amount a new user will be credited via their wallet when they join Deliiv</i></p>
                          <CInputGroup className="mb-3" style={{ width: '200px' }}>
                            <CInput
                              type="number"
                              placeholder="New user bonus"
                              name="newUserBonus"
                              value={newUserBonusValue}
                              onChange={e => setNewUserBonusValue(e.target.value)}
                            />
                          </CInputGroup>
                          <br />
                        </div>
                      }

                    </div>
                    <div style={{ flexDirection: "column" }}>
                      <div style={{ display: "flex", flexDirection: "row", margin: 20 }}>
                        <input type="checkbox"
                          value={refferalBonus}
                          checked={refferalBonus}

                          style={{ width: '40px', height: "40px" }}
                          onChange={e => setRefferalBonus(!refferalBonus)} />
                        <label for="" style={{ textAlign: "center", padding: "10px" }}> Referral </label>
                      </div>

                      {refferalBonus && <div style={{ paddingLeft: '50px' }}>
                        <p><i>This is the amount a user (An existing user) will be credited when a new user use their referral code to join Deliiv</i></p>
                        <CInputGroup className="mb-3" style={{ width: '200px' }}>
                          <CInput
                            type="number"
                            placeholder="Refferal Bonus"
                            name="refferalBonusValue"
                            value={refferalBonusValue}

                            onChange={e => setRefferalBonusValue(e.target.value)}
                          />
                        </CInputGroup>
                        <br />
                      </div>}
                    </div>
                    <div style={{ flexDirection: "column" }}>
                      <div style={{ display: "flex", flexDirection: "row", margin: 20 }}>
                        <input type="checkbox"
                          checked={freeDelivery}
                          value={freeDelivery}
                          style={{ width: '40px', height: "40px" }}
                          onChange={e => setFreeDelivery(!freeDelivery)} />
                        <label for="" style={{ textAlign: "center", padding: "10px" }}> Free delivery </label>
                      </div>
                      {freeDelivery &&
                        <div style={{ paddingLeft: '50px' }}>
                          <p>
                            <i>If the number of jobs a user has booked in a day which are
                              in picked-up or delivered status totals to the value below,
                              the next job (one job) after that will be free
                            </i>
                          </p>
                          <CInputGroup className="mb-3" style={{ width: '200px' }}>
                            <CInput
                              type="number"
                              placeholder="Free delivery"
                              name="refferalBonusValue"
                              value={freeDeliveryValue}

                              onChange={e => setFreeDeliveryValue(e.target.value)}
                            />
                          </CInputGroup>
                          <br />
                        </div>}

                    </div>
                    <div style={{ flexDirection: "column" }}>
                      <div style={{ display: "flex", flexDirection: "row", margin: 20 }}>
                        <input type="checkbox"
                          checked={discountStatus}
                          value={discountStatus}
                          style={{ width: '40px', height: "40px" }}
                          onChange={e => setDiscountStatus(!discountStatus)} />
                        <label for="" style={{ textAlign: "center", padding: "10px" }}>Job discount </label>
                      </div>
                      {discountStatus &&
                        <div style={{ paddingLeft: '50px' }}>
                          <p>
                            <i>Based on the percentage discount that is set below, discount will apply to all jobs at the point of payment
                            </i>
                          </p>
                          <CInputGroup className="mb-3" style={{ width: '200px' }}>
                            <CInput
                              type="number"
                              placeholder="Percentage discount"
                              name="discount"
                              value={discount}

                              onChange={e => setDiscount(e.target.value)}
                            />
                          </CInputGroup>
                          <br />

                        </div>}
                      <CButton
                        style={{ width: "100px", marginLeft: '20px' }}
                        color="info"
                        variant="outline"
                        size="sm"
                        // onClick={() => setUpdate(true)}
                        onClick={() => updateSystemBonus()}
                      >
                        update
                      </CButton>
                    </div>
                  </CFormGroup>

                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Settings;

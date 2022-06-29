import React, { useEffect, useState } from 'react'
import Switch from "react-switch";

export default function SmsProviderList() {
    const [smsProviderList, setSmsProviderList] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [tokenType, setTokenType] = useState(null);
    const [updateProvider, setUpdateProvider] = useState(null);
    const [editingNow, setEditingNow] = useState(null);
    const [show, setShow] = useState(false);

    const providerEnums = {

        PostaGuvercini: 1, MobilDev: 2, JetSMS: 3,
        MailJet: 4,
        Twilio: 5, InfoBip: 6, Vonage: 7
    }
    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }
    const addSmsProvider = () => {
        setShow(true);
    }

    const handleUpdate = () => {
        setEditingNow(null);
        console.log("update")
    }
    const fetchSmsProviderList = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `${tokenType} ${accessToken}`);


        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://c4f2.acsight.com:7770/api/system/sms-provider-list", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                setSmsProviderList(result.data.partnerProviders);
            })
            .catch(error => console.log('error', error));
    }
    const handleStatusChange = (provider) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `${tokenType} ${accessToken}`);

        const params = {
            id: provider.id,
            stat: !provider.status
        }

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(params),
            redirect: 'follow'
        };

        fetch("http://c4f2.acsight.com:7770/api/system/change-stat-partner-sms-provider", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
    const getToken = () => {
        const myHeaders = { "Content-Type": "application/x-www-form-urlencoded" }

        const params = new URLSearchParams();

        params.append("grant_type", "password");
        params.append("username", "test9@acsight.com");
        params.append("password", "123456O");
        params.append("client_id", "ClientIdWithFullAccess");
        params.append("client_secret", "fullAccessSecret");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: params
        };
        fetch("http://c4f2.acsight.com:7710/connect/token", requestOptions)
            .then(response => response.json())
            .then(result => {
                setTokenType(result.token_type);
                setAccessToken(result.access_token);

                console.log(result.access_token)
            })
            .catch(error => console.log('error', error));
    }


    useEffect(
        fetchSmsProviderList, [accessToken]
    )
    return (
        <div>
            <div>SmsProviderList</div>

            <button onClick={getToken}>Get Token</button>
            <button onClick={addSmsProvider}>Add Provider</button>
            {show &&
                <div>
                    <div>Add SMS Provider</div>

                </div>
            }


            {smsProviderList &&
                smsProviderList.map((provider) =>
                    <div>
                        <div> Provider: <div contentEditable={editingNow?.id == provider.id} onInput={e => setUpdateProvider({ ...updateProvider, providerID: e.currentTarget.textContent })}> {getKeyByValue(providerEnums, provider.providerID)} </div> </div>
                        <div> baseURL: <div contentEditable={editingNow?.id == provider.id} onInput={e => setUpdateProvider({ ...updateProvider, baseURL: e.currentTarget.textContent })}>{provider.baseURL}</div></div>
                        <div> fromName: <div contentEditable={editingNow?.id == provider.id} onInput={e => setUpdateProvider({ ...updateProvider, fromName: e.currentTarget.textContent })}>{provider.fromName}</div></div>
                        <div> username: <div contentEditable={editingNow?.id == provider.id} onInput={e => setUpdateProvider({ ...updateProvider, username: e.currentTarget.textContent })}>{provider.username}</div></div>
                        <div> password: <div contentEditable={editingNow?.id == provider.id} onInput={e => setUpdateProvider({ ...updateProvider, password: e.currentTarget.textContent })}>{provider.password}</div></div>
                        <div> vendorCode: <div contentEditable={editingNow?.id == provider.id} onInput={e => setUpdateProvider({ ...updateProvider, vendorCode: e.currentTarget.textContent })}>{provider.vendorCode}</div></div>
                        <div> apiKey: <div contentEditable={editingNow?.id == provider.id} onInput={e => setUpdateProvider({ ...updateProvider, apiKey: e.currentTarget.textContent })}>{provider.apiKey}</div></div>
                        <div> secretKey: <div contentEditable={editingNow?.id == provider.id} onInput={e => setUpdateProvider({ ...updateProvider, secretKey: e.currentTarget.textContent })}>{provider.secretKey}</div></div>
                        <div> accountSID: <div contentEditable={editingNow?.id == provider.id} onInput={e => setUpdateProvider({ ...updateProvider, accountSID: e.currentTarget.textContent })}>{provider.accountSID}</div></div>
                        <div> authToken: <div contentEditable={editingNow?.id == provider.id} onInput={e => setUpdateProvider({ ...updateProvider, authToken: e.currentTarget.textContent })}>{provider.authToken}</div></div>
                        <div> status:  <Switch onChange={() => handleStatusChange(provider)} checked={provider.status || false} /></div>
                        <div> updatedWhen:{provider.updatedWhen}</div>
                        <button onClick={() => setEditingNow({ ...editingNow, id: provider.id })}>Edit</button>
                        {editingNow?.id === provider?.id && <button onClick={() => handleUpdate()}>Update</button>}
                        <hr />
                        <div className="seperator"></div>
                    </div>
                )
            }

        </div>
    )
}

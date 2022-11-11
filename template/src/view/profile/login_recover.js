import React, { useState } from 'react';
import * as yup from 'yup';

import { Button, Input} from 'antd';

import { DataSource, AppModel } from '@essenza/core';
import { useControl, useForm, useGraph, Formix, FormixItem } from '@essenza/react';

function LoginRecoverController(c) {
    c.skin = LoginRecover;
    c.state = null;
    c.command = {
        RECOVERY: async (emailed, { model, route }) => {
            let form = c.form("loginrec-form");
            let result = await form.validate();
            if (result.isValid) {
                model.read(AppModel, m => m.passwordRequest(result.data.temail, route).then(r => emailed(true)));
            }
        }, 
        RESEND: (d,{model}) =>{
            if(c.state){
                model.read(AppModel, m => m.passwordRequest(c.state.temail, c.state.route).then(r => c.navigate("/loginrec")));
            }
        }
    }
}

export function LoginRecover({ vmodel }) {
    const [control] = useControl(LoginRecoverController);
    const [emailed, setEmailed] = useState(false);
    const settings = useGraph("system.settings").data;
    const form = useForm("loginrec-form", new DataSource({}), control, null, yup.object({
        temail: yup.string().required("Email è una informazione richiesta.").email("Formato email non corretto"),
    }));

    return (
        <>
            {!emailed ?
                <Formix control={control} form={form} layout='vertical' className="layout-form">
                    <FormixItem label="E-mail" name="temail">
                        <Input ></Input>
                    </FormixItem>
                    <FormixItem>
                        <Button className='block-pri h6' onClick={() => control.execute("RECOVERY", setEmailed, null, null, {route: settings.BaseUrl})}>
                            Invia Richiesta
                        </Button>
                    </FormixItem>
                    <Button style={{ padding: '0' }} className='bolder h6 primary' type="link" onClick={() => control.navigate("/login")}>Torna a Login</Button>
                </Formix>
                : <>
                    <h6>Check your email to recover your password.</h6>
                    <p style={{marginTop: '16px'}}>Email not got? <Button className='bolder h6 primary' type="link" onClick={() => setEmailed(false)}>
                        Send agin.
                    </Button></p>
                    <div>
                        <Button className='bolder h6 primary' onClick={() => control.navigate("/login")}>
                            Torna a Login
                        </Button>
                    </div>
                </>
            }
        </>
    )
}
import express from 'express';
import axios from 'axios';
import { configAuth } from '../../config';

const router = express.Router();
const urlRedirect = configAuth.auth.redirect_uri + '/auth';


import { AccessToken } from '../interface/token';

const options =
    {
        client_id: configAuth.auth.client_id,
        client_secret: configAuth.auth.client_secret,
        redirect_uri: configAuth.auth.redirect_uri,
        code: configAuth.auth.code
    }

async function exchangeAccessToken(domain: string, data: AccessToken) {

    const client = axios.create({
        baseURL: `https://${domain}`,
        timeout:  10000,
    });
    const exchangeData = {...data, grant_type: 'authorization_code'};

    const response = await client.post('/oauth2/access_token/', exchangeData);

    return response.data;
}

async function getLeads(domain: string, AccessToken: string, search: string) {
    const client = axios.create({
        baseURL: `https://${domain}`,
        timeout:  10000,
        
    });

    const response = await client.get(`/api/v4/leads?with=contacts&query=${search}`,{headers: {"Authorization": `Bearer ${AccessToken}`}});

    return response.data;

}
async function getStatus(domain: string, AccessToken: string, id_pipeline: string, id_status: string) {
    const client = axios.create({
        baseURL: `https://${domain}`,
        timeout:  10000,

    });
    const response = await client.get(`/api/v4/leads/pipelines/${id_pipeline}/statuses/${id_status}`,{headers: {"Authorization": `Bearer ${AccessToken}`}});

    return response.data;

}

async function getUser(domain: string, AccessToken: string, id_user: string) {
    const client = axios.create({
        baseURL: `https://${domain}`,
        timeout:  10000,

    });
    const response = await client.get(`/api/v4/users/${id_user}`,{headers: {"Authorization": `Bearer ${AccessToken}`}});

    return response.data;

}

async function getContact(domain: string, AccessToken: string, id_contact: string) {
    const client = axios.create({
        baseURL: `https://${domain}`,
        timeout:  10000,

    });
    const response = await client.get(`/api/v4/contacts/${id_contact}`,{headers: {"Authorization": `Bearer ${AccessToken}`}});

    return response.data;

}


function timeConverter(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);

    let year = a.getFullYear();
    let month = a.getMonth();
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();

    let time = date + '.' + month + '.' + year + ' ' + hour + ':' + min;
    return time;
}

router.get('/auth', async (req, res)=>{
    const token = await exchangeAccessToken(configAuth.domain, options);
    res.send(token);
})


router.get('/leads', async (req, res) => {
    console.log(req.query)
    const search = req.query.search || '';
    let status, user, date, contact, contactsData;
    // const token = await exchangeAccessToken(configAuth.domain, options);
    let token = req.query.token
    if(token){
        token = String(token);
    }
    else{
        throw Error;
    }
    const leadsData = await getLeads(configAuth.domain, token, String(search));
    const data = []
    console.log(leadsData)
    if(leadsData !== '') {

        const leads = leadsData._embedded.leads

        for (let i = 0; i < leads.length; i++) {
            const objectLead = {
                key: '',
                name: '',
                price: '',
                date: '',
                user: '',
                status: '',
                contact: [],

            }
            status = await getStatus(configAuth.domain, token, leads[i].pipeline_id, leads[i].status_id);
            user = await getUser(configAuth.domain, token, leads[i].responsible_user_id);
            date = timeConverter(leads[i].created_at); // date lead

            contactsData = leads[i]._embedded.contacts // contacts lead

            for (let j = 0; j < contactsData.length; j++) {
                contact = await getContact(configAuth.domain, token, contactsData[j].id);
                objectLead.contact.push({id: contact.id, name: contact.name});
            }

            objectLead.key = leads[i].id;
            objectLead.name = leads[i].name;
            objectLead.price = leads[i].price;
            objectLead.status = status.name;
            objectLead.user = user.name;
            objectLead.date = date;

            data.push(objectLead);
        }
    }

    res.send(data);

});

export const apiRoutes = router;

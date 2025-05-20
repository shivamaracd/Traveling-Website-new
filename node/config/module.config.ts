'use strict';
import { SessionManagment, CurrentSession } from '../lib/model/Session';
/* import { truncate } from 'fs'; */
const HashMap = require("hashmap");

export class DataFields {
    public field: string = "";
    public value?: string = "";
    public type?: boolean = false;
}

export class Module {
    public path: string = "";
    public table?: string = "";
    public fields?: string[] = [];
    public sqlqry?: string = "";
    public filter?: any;
    public group?: string = "";
    public order?: string = "";
    public limit?: number = -1;
    public type?: string = "";
    public session?: any;
    public keyfield?: any;
    public label?: string = "";
    public value?: string = "";
    public where?: boolean = false;
    public storedProcedure?: string = "";
}

export class Login {
    public postfield: DataFields[] = [];
    public tablefield: string[] = [];
    public selectfield: string[] = [];
    public md5: boolean = false;
    public table: string = "";
    public filter?: any;
}

export class Session {
    public session: string = "";
    public field: string[] = [];
    public table: string = "";
    public filter?: any;
}

export class modData {
    private _status: boolean = false;
    public data: Module[] = [

        /**************************************team member module***************************************/

        { sqlqry: "SELECT d.origin, d.booked_on,d.shipper, d.forwarding_no,d.consignee_name, d.status,d.delivery_date, d.delivery_time,d.received_by,d.relation,d.mobile_number,  d.created_at,d.updated_at, m.mode, m.forword_by, m.forwarding_number, c.client_name, c.client_description, c.client_address, c.client_address2, c.mobile_no, c.city, c.pincode, c.gst_no, c.email, c.bank_name, c.account_name, c.ifsc_code, s.id, s.client, s.client_department, s.tracking_number, s.tracking_number, s.order_date, s.destination_pincode, s.destinations, s.configurations_name, s.configurations_address, s.configurations_address1, s.destination_landmark, s.configurations_mobile_number, s.remark, s.remark2, s.volumetric_weight, s.weight, s.height, s.width, s.weight2, s.shipping_cost, d.status,  d.forwarding_no FROM shipment s INNER JOIN delivery d ON d.tracking_number = s.tracking_number INNER JOIN manifest m ON m.tracking_number = s.tracking_number INNER JOIN client c ON c.iduser = s.iduser WHERE ", path: "/report", session: { "s.iduser": "id" }, type: "report", order: "id desc" },


        // { table: "team_member", fields: ["id", "idaccount", "iduser", "username", "password", "type", "firstName", "lastName", "email", "mobileNo", "address", "country", "state", "city", "role", "profile_image"], session: { "iduser": "id" }, path: "/team", type: "main" },
        { table: "users", fields: ["id", "idaccount", "username", "password", "type", "email", "role"], path: "/team", type: "main", filter: { "type": "2" } },


        /**************************************client member module***************************************/

        // { table: "client", fields: ["id", "iduser", "client_name", "client_description", "client_address", "client_address2", "mobile_no", "city", "pincode", "gst_no", "email", "bank_name", "account_name", "ifsc_code"], session: { "iduser": "id" }, path: "/client", type: "client" },

        {
            table: "client",
            fields: [
                "id",
                "iduser",
                "client_name",
                "client_description",
                "client_address",
                "client_address2",
                "mobile_no",
                "city",
                "pincode",
                "gst_no",
                "email",
                "bank_name",
                "account_name",
                "account_number",
                "ifsc_code",
                "bank_city",
                "bank_state",
                "bank_country",
                "bank_pincode",
                "bank_email",
                "country",
                "state",
                "alias_name",
                "branch_name",
                "billing_company_name",
                "billing_company_address"
            ],
            session: { "iduser": "id" },
            path: "/client",
            type: "client"
        },


        /**************************************client member module***************************************/

        { table: "vander", fields: ["id", "iduser", "vandor_name", "vander_description", "vander_address", "vander_address2", "mobile_no", "city", "pincode", "gst_no", "email", "bank_name", "account_name", "ifsc_code", "branch", "country", "state", "contact_person", "bank_city", "bank_state", "bank_country", "bank_pincode", "bank_email", "account_number"], session: { "iduser": "id" }, path: "/vander", type: "vander" },

        /**************************************shipment member module***************************************/

        // { table: "shipment", fields: ["id", "iduser", "client", "client_department", "tracking_number", "order_date", "destination_pincode", "destinations", "configurations_name", "configurations_address", "configurations_address1", "destination_landmark", "configurations_mobile_number", "remark", "remark2", "volumetric_weight", "weight", "height", "width", "weight2", "shipping_cost", "created_at"], session: { "iduser": "id" }, path: "/shipment", type: "shipment" },


        { table: "shipment2", fields: ["id", "iduser", "awb_no", "ref_no", "booking_date", "client", "billing_service", "indent_no", "pickup_point", "consignor_name", "company_name", "origin_city", "state", "country", "pin_code", "mobile_no", "alt_mobile_no", "email_id", "gstin", "aadhaar_no", "warehousing_receipt_no", "challan_no","delivery_no", "po_no", "volumetric_weight", "pkgs","actual_weight", "weight_unit", "length","width", "height","divisor", "remark"], session: { "iduser": "id" }, path: "/shipment", type: "shipment" },
        /**************************************manifest member module***************************************/

        { table: "manifest", fields: ["id", "iduser", "tracking_number", "mode", "forword_by", "forwarding_number", "created_at"], session: { "iduser": "id" }, path: "/manifest", type: "manifest" },


        { table: "delivery", fields: ["id", "iduser", "tracking_number", "origin", "booked_on", "shipper", "forwarding_no", "consignee_name", "status", "delivery_date", "delivery_time", "received_by", "relation", "mobile_number", "created_at", "updated_at"], session: { "iduser": "id" }, path: "/delivery", type: "delivery" },

        /**************************************client member module***************************************/

        { table: "task", fields: ["id", "subject", "decripations", "priority", "status", "startDate", "deadline", "relatedTo"], session: { "iduser": "id" }, path: "/task", type: "main" },


        /**************************************cash type member module***************************************/

        { table: "case_type", fields: ["id", "iduser", "cash_type", "cash_sub_type"], session: { "iduser": "id" }, path: "/setting", type: "caseType" },

        /**************************************cash status member module***************************************/

        { table: "case_status", fields: ["id", "iduser", "case_status"], session: { "iduser": "id" }, path: "/setting", type: "caseStatus" },

        /**************************************court type member module***************************************/

        { table: "court_type", fields: ["id", "iduser", "court_type"], session: { "iduser": "id" }, path: "/setting", type: "courtType" },
        /**************************************court type member module***************************************/

        { table: "court", fields: ["id", "iduser", "court"], session: { "iduser": "id" }, path: "/setting", type: "court" },


        /**************************************judge type member module***************************************/

        { table: "judge", fields: ["id", "iduser", "judge"], session: { "iduser": "id" }, path: "/setting", type: "judge" },
        /**************************************judge type member module***************************************/


        { table: "tax_form", fields: ["id", "iduser", "first_name", "middle_name", "last_name", "email", "mobile_no", "gender", "address", "annual_income", "taxable_income", "tax_due"], session: { "iduser": "id" }, path: "/setting", type: "tax" },

        /**************************************Old module config***************************************/

        /**************************************User Profile***************************************/

        { table: "users", fields: ["id", "firstname", "lastname", "email", "contact", "profile_image", "password"], session: { "id": "id" }, path: "/userprofile", type: "main" },

        { table: "cel_account", fields: ["idaccount", "company_certificate", "company_pan_card", "director_pan_card"], session: { "idaccount": "idaccount" }, path: "/userprofile", type: "uploadProfile" },

        // { table: "session", fields: ["authkey"], path: "/logout", type: "main" },

        /**************************************Exectuive group*************************************/

        { table: "cel_groups", fields: ["id", "iduser", "name", "description", "exuctive_count", "exuctivename"], session: { "iduser": "id" }, path: "/groups", type: "main" },

        { sqlqry: "SELECT cu.idaccount, cu.username, cg.id, cg.iduser, cg.name, cg.description, cg.exuctive_count, cg.exuctivename FROM `cel_groups` cg INNER JOIN `cel_users` cu  ON cg.iduser=cu.id WHERE ", path: "/groups", session: { "cu.idaccount": "idaccount" }, type: "forCompanyGroup", order: "id desc" },

        { table: "agents", fields: ["id", "iduser", "first_name", "last_name"], session: { "iduser": "id" }, path: "/groups", type: "exectivename" },




    ];

    public get status(): boolean {
        return this._status;
    }

    public Search(path: string): Module[] {
        this._status = false;
        let ret: Module[] = [];
        this.data.forEach(element => {
            if (element.path == path) {
                ret.push(element);
                this._status = true;
            }
        });
        return ret;
    }

    public Type(type: string, row: Module[]): Module {
        this._status = false;
        let ret: Module = new Module();
        row.forEach(element => {
            if (element.type == type) {
                ret = element;
                this._status = true;
            }
        });
        return ret;
    }
}

export class modLogin {
    public data: Login = { table: "users", postfield: [{ field: "username", type: true }, { field: "password", type: true }], tablefield: ["username", "password"], selectfield: ["id", "username", "type", "email", "company", "balance", "plan", "idparent"], md5: false };

}

export class modSession {
    public data: Session = { table: "session", session: "authkey", field: ["id", "username", "type", "email", "company", "balance", "plan", "idparent", "idaccount"] };
}

export const sessiondata = new HashMap();
export const cursess = new CurrentSession();
export const getMod = new modData();
package api

import (
	"encoding/json"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
	"github.com/shipyard/shipyard/auth"
)

func (a *Api) serviceRegs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	serviceRegs, err := a.manager.ServiceRegs()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err := json.NewEncoder(w).Encode(serviceRegs); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (a *Api) saveServiceReg(w http.ResponseWriter, r *http.Request) {
	var serviceReg *auth.ServiceReg
	if err := json.NewDecoder(r.Body).Decode(&serviceReg); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err := a.manager.SaveServiceReg(serviceReg); err != nil {
		log.Errorf("error saving service registry: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Debugf("updated service registry: service-name=%s", serviceReg.ServiceName)
	w.WriteHeader(http.StatusNoContent)
}

func (a *Api) serviceReg(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	servicename := vars["service_name"]

	serviceReg, err := a.manager.ServiceReg(servicename)
	if err != nil {
		log.Errorf("error deleting service registry: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(serviceReg); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
func (a *Api) deleteServiceReg(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	servicename := vars["service_name"]

	serviceReg, err := a.manager.ServiceReg(servicename)
	if err != nil {
		log.Errorf("error deleting service registry: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err := a.manager.DeleteServiceReg(serviceReg); err != nil {
		log.Errorf("error deleting service registry: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Infof("deleted service registry: servicename=%s id=%s", serviceReg.ServiceName, serviceReg.ID)
	w.WriteHeader(http.StatusNoContent)
}

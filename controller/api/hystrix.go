package api

import (
	"net/http"
	"net/url"
	"encoding/json"
	"fmt"
	log "github.com/Sirupsen/logrus"
)

type CloudAddr struct {
    addr string `json:"addr"`
}

func (a *Api) hystrixRedirect(w http.ResponseWriter, req *http.Request) {
	var err error
	
	req.URL, err = url.ParseRequestURI(a.hUrl)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	a.fwd.ServeHTTP(w, req)
}

func (a *Api) getCloudAddr(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	var sopcloudAddr CloudAddr
	sopcloudAddr.addr = fmt.Sprintf("%s/hystrix.stream", a.sopcloudAddr)
	body, err := json.Marshal(sopcloudAddr)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Debugf("cloud addr: %s", fmt.Sprintf("%s/hystrix.stream", a.sopcloudAddr))
	log.Debugf("cloud addr: %s", body)
	
	if err := json.NewEncoder(w).Encode(sopcloudAddr); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}


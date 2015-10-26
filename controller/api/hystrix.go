package api

import (
	"net/http"
	"net/url"
	"encoding/json"
	"fmt"
)

type CloudAddr struct {
    Address string `json:"addr"`
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
	sopcloudAddr.Address = fmt.Sprintf("%s/hystrix.stream", a.sopcloudAddr)
	
	if err := json.NewEncoder(w).Encode(sopcloudAddr); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}


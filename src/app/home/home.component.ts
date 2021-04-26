import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';
import { NgbRatingConfig, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';
import { NgbdUploadModalContent } from '../modal/upload/upload.modal';
import { NgbdPlotModalContent } from '../modal/plot/plot.modal';
import { sortBy } from 'underscore';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbRatingConfig]
})
export class HomeComponent implements OnInit {
movies: any = [];
constantmovies: any = [];
page: any = 1;
collectionSize: any=0;
pageSize: any = 8;
  constructor(public c: CommonService, public config: NgbRatingConfig, private modalService: NgbModal) { 
    config.max = 5;
    
    console.log('Hi')
  }

  showPlot(m: any) {
    const modalRef = this.modalService.open(NgbdPlotModalContent);
    modalRef.componentInstance.name = m.movie_name;
    modalRef.componentInstance.plot = m.plot;
  }

  async setRating(val: any, m: any){
    
    if(val){
      console.log(val)
      ++m.rating_count;
      try{
        m.total_rating_value += val;
        const dataresponse = await this.c.postCall('save-movie', { info: m });
    
        const data: any = await dataresponse
        console.log(data);
        if(data.success){
          console.log('data Save was Successful');
        }
        else{
          --m.rating_count;
          console.log('data Save was unsuccessful');
        }
      }
      catch(e){
        console.log(e);
        --m.rating_count;
      }
    }
    // m.rate = val;
    
  }

  openUploadModal(m?: any){
    if(!m){
      m = {
        "movie_name": "",
        "poster_img": null,
        "genre": "",
        "lang": [],
        "release_date": null,
        "director": "",
        "plot": "",
        "rating_count": 0,
        "total_rating_value": 0,
        "created_date": null,
        "updated_date": null,
        "deleted": ""
      }
    }
    const modalRef = this.modalService.open(NgbdUploadModalContent);
    modalRef.componentInstance.data = m;
    modalRef.result.then((rst)=>{
      console.log('modal has closed');
      if(rst == 'Saved'){
        this.initialize()
      }
    }).catch(e=> console.log(e));
  }

  searchFilter(e: any){
    let text = e.target.value
    if (text.length > 1) {
      let searchKeys: any = [];
      searchKeys = ["movie_name", "genre", "rdate", "director", "lang", "file_type", "filename"];
      let data = JSON.parse(JSON.stringify(this.constantmovies));
      this.movies = _.filter(data, (v, i) => {
        let searchTxt = "";
        for (var key in v) {
          if (_.contains(searchKeys, key)) {
            if(key == 'lang'){
              v[key] = v[key].join(' ')
            }
            searchTxt = searchTxt + " " + v[key].toString().toLowerCase();
          }
        }
        let exp = text.toLowerCase();
        return searchTxt.indexOf(exp) != -1;
      });
      this.movies = _.sortBy(this.movies, 'release_date').reverse()
    }
    else {
      this.movies = this.constantmovies;
    }
    this.pageChange(1);
  }

  sortMovies(attr: any){
    
    if(attr == 'release_date' || attr == 'created_date'){
      this.movies = _.sortBy(this.movies, attr).reverse()
      this.constantmovies = _.sortBy(this.constantmovies, attr).reverse()
    }
    else{
      this.movies = _.sortBy(this.movies, attr)
      this.constantmovies = _.sortBy(this.constantmovies, attr)
    }
    this.pageChange(1);
  }

  ngOnInit() {
    this.c.headeroptions = true;
    this.initialize();
  }

  pageChange(val: any){
    console.log(val);
    let start = (val*this.pageSize)-this.pageSize, end = (val*this.pageSize)-1;
    console.log(start, end)
    this.movies = _.filter(this.constantmovies, (c, i)=>{
      return i >= start && i<=end;
    })
  }

  async initialize(){
    console.log('initialize')
    try{
      const response = await this.c.postCall('list-movies',{});

      const data: any = await response
      console.log(data);

      if(data.success){
        console.log(JSON.stringify(data.data))
        this.collectionSize = data.data.length
        _.each(data.data, (m:any)=>{
          m.rate = m.total_rating_value / m.rating_count;
        })
        data.data = _.sortBy(data.data, 'release_date').reverse()
        this.movies = data.data;
        this.constantmovies = data.data;
      }
      else{
        this.movies = [];
        this.constantmovies = [];
      }
      this.pageChange(1);
    }
    catch(e){
      console.log('Catch error')
      console.log(e);
    }
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';
import { NgbRatingConfig, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';
import { NgbdUploadModalContent } from '../modal/upload/upload.modal';
import { NgbdPlotModalContent } from '../modal/plot/plot.modal';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbRatingConfig]
})
export class HomeComponent implements OnInit {
movies: any = [];
  constructor(public c: CommonService, public config: NgbRatingConfig, private modalService: NgbModal) { 
    config.max = 5;
    console.log('Hi')
  }

  showPlot(m: any) {
    const modalRef = this.modalService.open(NgbdPlotModalContent);
    modalRef.componentInstance.name = m.movie_name;
    modalRef.componentInstance.plot = m.plot;
  }

  setRating(val: any, m: any){
    console.log(val)
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

  ngOnInit() {
    this.initialize();
  }

  async initialize(){
    console.log('initialize')
    try{
      const response = await this.c.postCall('check',{});

      const data: any = await response
      console.log(data);

      if(data.success){
        console.log(JSON.stringify(data.data))
        this.movies = data.data;
        _.each(this.movies, (m:any)=>{
          m.rate = m.total_rating_value / m.rating_count;
        })
      }
      else{
        this.movies = [];
      }
    }
    catch(e){
      console.log('Catch error')
      console.log(e);
    }
  }

}

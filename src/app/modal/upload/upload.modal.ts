import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';
import { CommonService } from '../../service/common.service';

@Component({
    selector: 'ngbd-upload-modal-content',
    styleUrls: ['./upload.modal.scss'],
    templateUrl: './upload.modal.html'
  })
  export class NgbdUploadModalContent implements OnInit {
    @Input() data: Object | any;
    @ViewChild('posterimg', { static: true }) posterimg: any;
    lang: any = {
      English: false,
      Tamil: false,
      French: false
    };
    src: any = '';
    file: any;
    constructor(public activeModal: NgbActiveModal, public c: CommonService) {}

    ngOnInit(){
      this.lang = {
        English: false,
        Tamil: false,
        French: false
      };
      if(this.data._id){
        _.each(this.data.lang, (l: any)=>{
          console.log(l)
          this.lang[l]=true;
        })
        if(this.data.release_date){
          let month: any = (this.c.getMonth(this.data.release_date)+1).toString();
          if(month.length === 1){
            month = '0'+month
          }
          let date: any = (this.c.getDate(this.data.release_date)).toString();
          if(date.length === 1){
            date = '0'+date
          }
          this.data.rdate = this.c.getFullYear(this.data.release_date) + '-'
          + month + '-'
          + date;
          console.log('rdate', this.data.rdate)
        }
      }
      
    }

    selectFile(){
      this.posterimg.nativeElement.click();
    }

    setReleaseDate(e: any){
      console.log(e);
      this.data.rdate = e.target.value
      this.data.release_date = Number(new Date(e.target.value));
    }

    fileChangeEvent(event: any){
      const fileList: FileList = event.target.files;
      let extnImg = ['png', 'jpeg', 'jpg', 'tif', 'gif', 'webp']
      if(fileList.length > 0) {
        let file: File = fileList[0];
        const extn = file.name.split(".")[file.name.split(".").length-1];
        console.log("File Name is ", file.name);
        
        if(_.contains(extnImg, extn.toLowerCase())){
          this.file = file;
          var reader  = new FileReader();
          reader.addEventListener("load",  () => {
            this.src = reader.result;
          }, false);
        
          if (file) {
            reader.readAsDataURL(file);
          }
        }
        else{
          console.log('Unsupported Img Frmt')
          this.file = undefined;
        }
      }
      else{
        this.file = undefined;
      }
      
    }

    imgErr(e: any){
      e.target.src = 'assets/default_movie.webp'
    }

    isValid(){
      if(this.data.movie_name.trim()){
        return true
      }
      return false;
    }

    async save(){
      console.log(this.data)
      if(!this.isValid()){
        alert('Provide movie name before saving')
        return;
      }
      if(confirm('Are you sure you want to SAVE this movie?')){
        let saveData: any = this.data;
        saveData = JSON.parse(JSON.stringify(saveData));
        if(this.data._id){
          saveData['updated_date'] = Date.now();
        }
        else{
          saveData['created_date'] = Date.now();
        }
  
        delete saveData.rdate;
        delete saveData.rate;
        console.log(saveData)
        try{
          const metadataresponse = await this.c.postCall('save-movie', { info: saveData });
  
          const metadata: any = await metadataresponse
          console.log(metadata);
  
          if(metadata.success){
            if(this.file){
              let _id = this.data._id ? this.data._id : metadata.data.value._id;
              let formData = new FormData();
              formData.append('filepath', './'+_id+'/');
              formData.append('file', this.file, this.file.name);
    
              const response = await this.c.postCall('upload-poster', formData);
    
              const data: any = await response
              console.log(data);
    
              if(data.success){
                saveData['poster_img'] = _id + '/' + this.file.name;
                console.log(saveData);
                if(!this.data._id && metadata.data.value._id){
                  saveData['_id'] = metadata.data.value._id
                }
                const postimginforesponse = await this.c.postCall('save-movie', { info: saveData });
  
                const postimginfo: any = await postimginforesponse
                console.log(postimginfo);
                if(postimginfo.success){
                  this.activeModal.close('Saved')
                }
                else{
                  console.log('Postimginfo Save was unsuccessful');
                }
              }
              else{
                console.log('File Save was unsuccessful');
              }
            }
            else{
              console.log('Metadata Save was Successful');
              this.activeModal.close('Saved')
            }
          }
          else{
            console.log('Metadata Save was unsuccessful');
          }
        }
        catch(e){
          console.log(e)
        }
      }
    }

    async delete(){
      if(confirm('Are you sure you want to DELETE this movie?')){
        console.log(this.data)
        let deleteData: any = this.data;
        deleteData = JSON.parse(JSON.stringify(deleteData));
        deleteData['deleted'] = 'Y';
        console.log(deleteData)
        try{
          const metadataresponse = await this.c.postCall('save-movie', { info: deleteData });
  
          const metadata: any = await metadataresponse
          console.log(metadata);
  
          if(metadata.success){
            console.log('Metadata for deletion Save was Successful');
            this.activeModal.close('Saved')
          }
        }
        catch(e){
          console.log(e)
        }
      }
      
    }

    set(e: any, attr: any){
      this.data[attr] = e.target.value;
    }

    setLang(e: any, attr: any){
      console.log(e.target.checked)
      this.lang[attr] = e.target.checked;
      this.data.lang = [];
      Object.entries(this.lang).forEach(([key, value]) => {
        console.log(key, value);
        if(value){
          this.data.lang.push(key);
        }
      });
    }
  }
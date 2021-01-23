### Preguntas frecuentes

## Al intentar hacer push el Git me pide un nombre de usuario y correo

!!! warning "Si al hacer un commit la primera vez tenemos este aviso"

    ```sh
    Run 

    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"

    to set your account's default identity.
    Omit --global to set the identity only in this repository.

    fatal: unable to auto-detect email address (got 'usuario@yourpc.(none)')
    ```


!!! Tip "Entramos nuestor usuario y correo de git y volvemos a hacer push"

    ```sh

    git config --global user.email micorreo@gmail.com
    git config --global user.name  misusuario

    git pull
    git add .
    git commit -m "change readme"
    git push -u origin master       

   
    ```


## Medium no me deja publicar el Post


!!! warning "Si al intenar publicar un Post por primera vez Medium me dice.."

    
    * "Publishing from your account is currently limited due to account newness, incomplete profile, or inactivity.
     Please complete your profile, and use Medium more to unlock publishing. 
     Any posts or responses have been saved to your draft folder and will be available when youre able to publish."




!!! Tip "Medium tiene que validar nuestra cuenta el Post"

    * Editamos nuestro perfil con un texto descriptivo y una imagen (no hace falta foto personal si no quereis)
    * Salimos de la sesión de Medium (LogOut) y volvemos a entrar (Login)
    * Si aún así no funciona, esperamos 24h. En principio después de este periodo nos tendria que dejar publicar sin problemas